/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateSelectionQuota,
  validateFinalSubmission,
} from './selection-rules.ts';

test('evaluateSelectionQuota allows selection when below limit', () => {
  const result = evaluateSelectionQuota(20, 60, true);
  assert.equal(result.canSelect, true);
  assert.equal(result.selectedCount, 21);
  assert.equal(result.remaining, 39);
  assert.equal(result.isAtLimit, false);
});

test('evaluateSelectionQuota blocks selection when at limit', () => {
  const result = evaluateSelectionQuota(60, 60, true);
  assert.equal(result.canSelect, false);
  assert.equal(result.selectedCount, 60);
  assert.equal(result.remaining, 0);
  assert.equal(result.isAtLimit, true);
  assert.match(result.reason || '', /Package limit reached/);
});

test('evaluateSelectionQuota always allows deselecting', () => {
  const result = evaluateSelectionQuota(60, 60, false);
  assert.equal(result.canSelect, true);
  assert.equal(result.selectedCount, 59);
  assert.equal(result.remaining, 1);
});

test('evaluateSelectionQuota blocks selections when gallery is locked', () => {
  const result = evaluateSelectionQuota(45, 60, true, true);
  assert.equal(result.canSelect, false);
  assert.match(result.reason || '', /already been submitted/);
});

test('validateFinalSubmission enforces min and max bounds', () => {
  assert.equal(validateFinalSubmission(0, 60).isValid, false);
  assert.equal(validateFinalSubmission(65, 60).isValid, false);
  assert.equal(validateFinalSubmission(50, 60).isValid, true);
  assert.equal(validateFinalSubmission(60, 60).isValid, true);
});
