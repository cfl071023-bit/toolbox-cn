import { describe, expect, it } from 'vitest';
import { formatTextPart } from './unicode-formatter.service';

describe('unicode-formatter', () => {
  it('formatTextPart applies correct style/font on text part', async () => {
    expect(formatTextPart('The quick fox', 4, 9, 'sansBold')).to.deep.equal({
      from: 4,
      text: 'The 𝗾𝘂𝗶𝗰𝗸 fox',
      to: 14,
    });
    expect(formatTextPart('The quick fox', 4, 13, 'boldScript')).to.deep.equal({
      from: 4,
      text: 'The 𝓺𝓾𝓲𝓬𝓴 𝓯𝓸𝔁',
      to: 21,
    });
    expect(formatTextPart('The quick fox', 4, 6, 'smallCaps')).to.deep.equal({
      from: 4,
      text: 'The ꞯᴜick fox',
      to: 6,
    });
    expect(formatTextPart('The quick fox', 4, 8, 'inverted')).to.deep.equal({
      from: 4,
      text: 'The bnıɔk fox',
      to: 8,
    });
    expect(formatTextPart('The quick fox', 4, 10, 'mirrored')).to.deep.equal({
      from: 4,
      text: 'The pυiↄʞ fox',
      to: 10,
    });
    expect(formatTextPart('The quick fox', 4, 11, 'serifBoldItalic')).to.deep.equal({
      from: 4,
      text: 'The 𝒒𝒖𝒊𝒄𝒌 𝒇ox',
      to: 17,
    });
  });

  it('formatTextPart un-applies correct style/font on text part', async () => {
    expect(formatTextPart('The 𝗾𝘂𝗶𝗰𝗸 fox', 4, 14, 'sansBold')).to.deep.equal({
      from: 4,
      text: 'The quick fox',
      to: 9,
    });
    expect(formatTextPart('The 𝓺𝓾𝓲𝓬𝓴 𝓯𝓸𝔁', 4, 18, 'boldScript')).to.deep.equal({
      from: 4,
      text: 'The quick f𝓸𝔁',
      to: 12,
    });
    expect(formatTextPart('The 𝓺𝓾𝓲𝓬𝓴 𝓯𝓸𝔁', 4, 14, 'boldScript')).to.deep.equal({
      from: 4,
      text: 'The quick 𝓯𝓸𝔁',
      to: 9,
    });
    expect(formatTextPart('The 𝓺𝓾𝓲𝓬𝓴 fox', 4, 15, 'boldScript')).to.deep.equal({
      from: 4,
      text: 'The quick fox',
      to: 10,
    });
    expect(formatTextPart('The pυiↄʞ fox', 4, 10, 'mirrored')).to.deep.equal({
      from: 4,
      text: 'The puick fox', // can't be fully restored
      to: 10,
    });
    expect(formatTextPart('The bnıɔk fox', 4, 10, 'inverted')).to.deep.equal({
      from: 4,
      text: 'The quıɔʞ fox',
      to: 10,
    });
    expect(formatTextPart('The 𝒒𝒖𝒊𝒄𝒌 𝒇ox', 4, 17, 'serifBoldItalic')).to.deep.equal({
      from: 4,
      text: 'The quick fox',
      to: 11,
    });
  });
});
