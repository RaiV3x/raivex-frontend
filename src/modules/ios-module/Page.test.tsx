import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Page from './Page';

const token = 'a'.repeat(64);
beforeEach(() => {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockResolvedValue(undefined) } });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it('generates, hides, reveals and copies a pullable URL without player forms', async () => {
  render(<Page />);
  const copy = screen.getByRole('button', { name: /复制订阅地址/ }) as HTMLButtonElement;
  expect(copy.disabled).toBe(true);
  fireEvent.click(screen.getByRole('button', { name: '生成令牌' }));
  const input = screen.getByLabelText('随机令牌') as HTMLInputElement;
  expect(input.value).toMatch(/^[0-9a-f]{64}$/);
  expect(input.type).toBe('password');
  fireEvent.click(screen.getByRole('button', { name: '显示令牌' }));
  expect(input.type).toBe('text');
  fireEvent.click(copy);
  await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledWith(`https://api.raivex.xyz:8443/mysekaibot_cn.sgmodule?token=${input.value}`));
  expect(screen.queryByLabelText(/UID|白名单/)).toBeNull();
  expect(screen.getByRole('heading', { name: '上传数据' })).toBeTruthy();
});
it('validates pasted tokens and prevents unintended replacement', () => {
  render(<Page />);
  const input = screen.getByLabelText('随机令牌') as HTMLInputElement;
  fireEvent.change(input, { target: { value: 'bad' } });
  expect(screen.getByRole('status').textContent).toContain('64 位');
  expect((screen.getByRole('button', { name: /复制订阅地址/ }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.change(input, { target: { value: token } });
  vi.spyOn(window, 'confirm').mockReturnValue(false);
  fireEvent.click(screen.getByRole('button', { name: '生成令牌' }));
  expect(input.value).toBe(token);
  vi.spyOn(window, 'confirm').mockReturnValue(true);
  fireEvent.click(screen.getByRole('button', { name: '生成令牌' }));
  expect(input.value).not.toBe(token);
});
it('downloads via the public module endpoint and never stores the token', () => {
  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
    expect(this.href).toBe(`https://api.raivex.xyz:8443/mysekaibot_cn.sgmodule?token=${token}`);
    expect(this.referrerPolicy).toBe('no-referrer');
  });
  const store = vi.spyOn(Storage.prototype, 'setItem');
  render(<Page />);
  fireEvent.change(screen.getByLabelText('随机令牌'), { target: { value: token } });
  fireEvent.click(screen.getByRole('button', { name: '下载 .sgmodule' }));
  expect(click).toHaveBeenCalledOnce();
  expect(store).not.toHaveBeenCalled();
});
it('reports clipboard failure and missing secure randomness without crashing', async () => {
  render(<Page />);
  fireEvent.change(screen.getByLabelText('随机令牌'), { target: { value: token } });
  vi.mocked(navigator.clipboard.writeText).mockRejectedValue(new Error('denied'));
  fireEvent.click(screen.getByRole('button', { name: /复制订阅地址/ }));
  await waitFor(() => expect(screen.getByRole('status').textContent).toContain('手动复制'));
  vi.spyOn(window, 'confirm').mockReturnValue(true);
  vi.spyOn(crypto, 'getRandomValues').mockImplementation(() => { throw new Error('unavailable'); });
  fireEvent.click(screen.getByRole('button', { name: '生成令牌' }));
  expect(screen.getByRole('status').textContent).toContain('安全令牌');
  expect((screen.getByLabelText('随机令牌') as HTMLInputElement).value).toBe(token);
});

it('shows submission methods only for selected data types', () => {
  render(<Page />);
  const mysekai = screen.getByRole('checkbox', { name: 'MySekai 数据' }) as HTMLInputElement;
  const usersuite = screen.getByRole('checkbox', { name: 'UserSuite 数据' }) as HTMLInputElement;
  expect(mysekai.checked).toBe(true);
  expect(usersuite.disabled).toBe(false);
  expect(usersuite.checked).toBe(false);
  fireEvent.change(screen.getByLabelText('随机令牌'), { target: { value: token } });
  fireEvent.click(mysekai);
  expect(screen.queryByRole('button', { name: '复制订阅地址' })).toBeNull();
  expect(screen.getByText('勾选数据类型以显示提交方式。')).toBeTruthy();
  fireEvent.click(usersuite);
  const upload = screen.getByRole('link', { name: '打开数据接收页' }) as HTMLAnchorElement;
  expect(upload.href).toBe('https://admin.raivex.xyz/admin/usersuite');
  expect(screen.queryByRole('button', { name: '下载 .sgmodule' })).toBeNull();
  fireEvent.click(mysekai);
  expect((screen.getByLabelText('随机令牌') as HTMLInputElement).value).toBe(token);
  expect((screen.getByRole('button', { name: '复制订阅地址' }) as HTMLButtonElement).disabled).toBe(false);
});
