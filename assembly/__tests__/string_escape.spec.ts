import { JSON } from '..';

describe('Escaped characters', () => {
  it('Does not escape characters unneccessarily', () => {
    const strings = [
      'sphinx of black quartz, judge my vow',
      '{}',
      '[]',
      '/',
      '|',
      '/|||/|||[{]}<>,.',
      'ஂ ஃ அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ க ங ச ஜ ஞ ட ண த ந ன ப ம ய ர ற ல ள',
      'ᄀ ᄁ ᄂ ᄃ ᄄ ᄅ ᄆ ᄇ ᄈ ᄉ ᄊ ᄋ ᄌ ᄍ ᄎ ᄏ ᄐ ᄑ ᄒ ᄓ ᄔ ᄕ ᄖ ᄗ ᄘ ᄙ ᄚ ᄛ ',
      '℀ ℁ ℂ ℃ ℄ ℅ ℆ ℇ ℈ ℉ ℊ ℋ ℌ ℍ ℎ ℏ ℐ ℑ ℒ ℓ ℔ ℕ № ℗ ℘ ℙ ℚ ℛ ℜ ℝ ℞ ℟ ℠ ℡ ™ ℣ ℤ ℥ Ω ℧ ℨ ℩ K Å ℬ ℭ ℮ ℯ ℰ ℱ Ⅎ ℳ ℴ ℵ ℶ ℷ ℸ ',
      '☀ ☁ ☂ ☃ ☄ ★ ☆ ☇ ☈ ☉ ☊ ☋ ☌ ☍ ☎ ☏ ☐ ☑ ☒ ☓ ☚ ☛ ☜ ☝ ☞ ☟ ☠ ☡ ☢ ☣ ☤ ☥ ☦ ☧ ☨ ☩ ☪ ☫ ☬ ☭ ☮ ☯ ☰ ☱ ☲ ☳ ☴ ☵ ☶ ☷ ☸ ☹ ☺ ☻ ☼ ☽ ☾ ☿ ♀ ♁ ♂ ♃ ♄ ♅ ♆ ♇ ♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓',
    ];
    strings.forEach((str) => {
      const jsonStr = new JSON.Str(str);
      expect(jsonStr.stringify()).toBe(`"${str}"`);
    });
  });

  it('Escapes quotes and backslashes', () => {
    const strings = ['"', '\\', '"\\"', '\\"\\"'];
    // Computed using javascript's JSON as implemented in mozilla firefox 90.0 (64-bit)
    const expected = ["\"\\\"\"", "\"\\\\\"", "\"\\\"\\\\\\\"\"", "\"\\\\\\\"\\\\\\\"\""];

    for(let i=0; i<strings.length; i++){
      const jsonStr = new JSON.Str(strings[i]);
      expect(jsonStr.stringify()).toBe(expected[i]);
    }
  });

  it('Escapes control characters', () => {
    const strings = ['\n', '\r', '\r\n', '\b', '\f', '\t', '\v', '\b\f\t\v\r'];
    // Computed using javascript's JSON as implemented in mozilla firefox 90.0 (64-bit)
    const expected = ["\"\\n\"","\"\\r\"","\"\\r\\n\"","\"\\b\"","\"\\f\"","\"\\t\"","\"\\u000b\"","\"\\b\\f\\t\\u000b\\r\""];

    for(let i=0; i<strings.length; i++){
      const jsonStr = new JSON.Str(strings[i]);
      expect(jsonStr.stringify()).toBe(expected[i]);
    }
  });

  it('Does not escape ANSI escape sequences', () => {
    const input = '{"message":"test message with \\u001b[31m color coding"}';
    const parsed = JSON.parse(input);
    expect(parsed.stringify()).toBe(input);
  });

  it('Maintains characters above 0xFFFF', () => {
    const input = '{"emoji":"😀"}';
    const parsed = JSON.parse(input);
    expect(parsed.stringify()).toBe(input);
  });

  it('Does not crash when surrogate pair escape sequences', () => {
    const input = '{"emoji":"\ud83d\ude00"}'; // Escaped grinning face emoji
    const parsed = JSON.parse(input);
    expect(parsed.stringify()).toBe(input);
  });

  it('Escapes control characters with unicode escape sequences', () => {
    // Test some control characters that aren't special cases
    const inputs = [
      '{"control":"\\u0001"}',
      '{"control":"\\u0002"}',
      '{"control":"\\u0003"}',
      '{"control":"\\u001f"}'
    ];
    const expected = [
      '{"control":"\\u0001"}',
      '{"control":"\\u0002"}',
      '{"control":"\\u0003"}',
      '{"control":"\\u001f"}'
    ];

    for(let i=0; i<inputs.length; i++) {
      const parsed = JSON.parse(inputs[i]);
      expect(parsed.stringify()).toBe(expected[i]);
    }
  });
});
