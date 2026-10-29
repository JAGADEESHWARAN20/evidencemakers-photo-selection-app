/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractBaseFilename,
  getExtension,
  isRawExtension,
  isJpegExtension,
  groupAndPairFiles,
} from './pairing.ts';

test('extractBaseFilename strips extension correctly', () => {
  assert.equal(extractBaseFilename('_DSC4821.CR3'), '_DSC4821');
  assert.equal(extractBaseFilename('EM_Wedding_2026.final.jpg'), 'EM_Wedding_2026.final');
  assert.equal(extractBaseFilename('no_extension'), 'no_extension');
});

test('getExtension normalizes extension to uppercase without dot', () => {
  assert.equal(getExtension('photo.cr3'), 'CR3');
  assert.equal(getExtension('photo.JPG'), 'JPG');
  assert.equal(getExtension('photo.dng'), 'DNG');
  assert.equal(getExtension('photo'), '');
});

test('extension detectors identify supported formats', () => {
  assert.equal(isRawExtension('CR2'), true);
  assert.equal(isRawExtension('CR3'), true);
  assert.equal(isRawExtension('NEF'), true);
  assert.equal(isRawExtension('ARW'), true);
  assert.equal(isRawExtension('DNG'), true);
  assert.equal(isRawExtension('PNG'), false);
  assert.equal(isJpegExtension('JPG'), true);
  assert.equal(isJpegExtension('JPEG'), true);
  assert.equal(isJpegExtension('TIFF'), false);
});

test('groupAndPairFiles pairs matching RAW and JPEG files', () => {
  const files = [
    { name: '_DSC001.JPG', size: 5000000 },
    { name: '_DSC001.CR3', size: 35000000 },
    { name: '_DSC002.jpg', size: 4800000 }, // lowercase
    { name: '_DSC002.NEF', size: 42000000 },
  ];

  const result = groupAndPairFiles(files);
  assert.equal(result.length, 2);
  assert.equal(result[0].status, 'paired');
  assert.equal(result[0].rawExtension, 'CR3');
  assert.equal(result[1].status, 'paired');
  assert.equal(result[1].rawExtension, 'NEF');
});

test('groupAndPairFiles flags unpaired and duplicate files', () => {
  const files = [
    { name: '_DSC100.JPG' }, // jpeg only
    { name: '_DSC101.ARW' }, // raw only
    { name: '_DSC102.JPG' },
    { name: '_DSC102.jpeg' }, // duplicate JPEG
  ];

  const result = groupAndPairFiles(files);
  const jpegOnly = result.find((r) => r.baseFilename === '_DSC100');
  const rawOnly = result.find((r) => r.baseFilename === '_DSC101');
  const duplicate = result.find((r) => r.baseFilename === '_DSC102');

  assert.equal(jpegOnly?.status, 'jpeg_only');
  assert.equal(rawOnly?.status, 'raw_only');
  assert.equal(duplicate?.status, 'duplicate');
});
