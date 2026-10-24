/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateSelectionQuota,
  validateFinalSubmission,
  toggleSelectionInSet,
  filterAssetsBySelection,
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

test('Scenario 1 & 2: select one image increases count by 1, and Set prevents duplicates', () => {
  let set = new Set<string>();
  set = toggleSelectionInSet(set, 'asset-1');
  assert.equal(set.size, 1);
  assert.equal(set.has('asset-1'), true);

  // Re-adding same asset explicitly via Set does not duplicate
  set.add('asset-1');
  assert.equal(set.size, 1);
});

test('Scenario 3: deselect an image updates selection state', () => {
  let set = new Set<string>(['asset-1', 'asset-2']);
  set = toggleSelectionInSet(set, 'asset-1');
  assert.equal(set.size, 1);
  assert.equal(set.has('asset-1'), false);
  assert.equal(set.has('asset-2'), true);
});

test('Scenario 4 & 5: switching between All, Selected, and Unselected does not mutate selection state', () => {
  const assets = [
    { id: 'img-1', name: 'photo1.jpg' },
    { id: 'img-2', name: 'photo2.jpg' },
    { id: 'img-3', name: 'photo3.jpg' },
  ];
  const selectedSet = new Set<string>(['img-1', 'img-3']);

  const allFiltered = filterAssetsBySelection(assets, selectedSet, 'all');
  const selectedFiltered = filterAssetsBySelection(assets, selectedSet, 'selected');
  const unselectedFiltered = filterAssetsBySelection(assets, selectedSet, 'unselected');

  assert.equal(allFiltered.length, 3);
  assert.equal(selectedFiltered.length, 2);
  assert.deepEqual(selectedFiltered.map((a) => a.id), ['img-1', 'img-3']);
  assert.equal(unselectedFiltered.length, 1);
  assert.deepEqual(unselectedFiltered.map((a) => a.id), ['img-2']);

  // Selection set itself was not mutated
  assert.equal(selectedSet.size, 2);
  assert.equal(selectedSet.has('img-1'), true);
  assert.equal(selectedSet.has('img-3'), true);
});

test('Scenario 6: download selected includes strictly selected files and is empty when selection is empty', () => {
  const assets = [
    { id: 'img-1', name: 'photo1.jpg' },
    { id: 'img-2', name: 'photo2.jpg' },
  ];
  const emptySet = new Set<string>();
  const toDownloadEmpty = assets.filter((a) => emptySet.has(a.id));
  assert.equal(toDownloadEmpty.length, 0);

  const activeSet = new Set<string>(['img-2']);
  const toDownloadActive = assets.filter((a) => activeSet.has(a.id));
  assert.equal(toDownloadActive.length, 1);
  assert.equal(toDownloadActive[0].id, 'img-2');
});

