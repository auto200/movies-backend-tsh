import { expect, test } from "vitest";
import { isNumberInTolerance } from ".";

test("number in tolerance", () => {
  const value1 = 80;
  const middlePoint1 = 100;
  const tolerance1 = 20;
  expect(isNumberInTolerance(value1, middlePoint1, tolerance1)).toBeTruthy();

  const value2 = 120;
  const middlePoint2 = 100;
  const tolerance2 = 20;
  expect(isNumberInTolerance(value2, middlePoint2, tolerance2)).toBeTruthy();

  const value3 = 120;
  const middlePoint3 = 100;
  const tolerance3 = 10;
  expect(isNumberInTolerance(value3, middlePoint3, tolerance3)).toBeFalsy();
});
