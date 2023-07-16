import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react-hooks';

import useTestHook from '@/hooks/useTestHook';

describe("useTestHook hook example", () => {

  it('should get the init hook value', () => {
    const { result } = renderHook(() => useTestHook());
    expect(result.current.val).toBe(0);
  })

  it('should increment the hook', () => {
    const { result } = renderHook(() => useTestHook());
    act(() => {
      result.current.inc();
    })
    expect(result.current.val).toBe(1);
  })
})