const sum = (a, b) => a + b;

it("Creates actor according to specs", () => {
    expect(sum(1, 2)).toBe(3);
});