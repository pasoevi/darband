const sum = (a: number, b: number) => a + b;

it("Creates actor according to specs", () => {
    expect(sum(1, 2)).toBe(3);
});