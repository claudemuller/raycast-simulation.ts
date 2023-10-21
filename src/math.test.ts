import { deg2rad } from "./math";

test('converts 180 degress to radians', () => {
  expect(deg2rad(180)).toBe(3.141592653589793);
});
