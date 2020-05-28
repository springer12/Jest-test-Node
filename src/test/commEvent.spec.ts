
test('test of test', async() => {
    expect(await(async()=> 5)()).toBe(5);
});


