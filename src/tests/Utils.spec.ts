import { flatten, shuffle, tryTo } from '../Util';

describe('Utils', () => {
    describe('flatten', () => {
        it('should correctly flatten 2-level array', () => {
            expect(flatten([['abc', 'def'], [123, 456]])).toEqual(['abc', 'def', 123, 456]); 
        });

        it('should return already flat array in the same order', () => {
            expect(flatten(['abc', 'def', 123, 456])).toEqual(['abc', 'def', 123, 456]); 
        });
    });

    describe('tryTo', () => {
        it('should try an action 1000 times', () => {
            let counter = 1000;
            const tesAction = jest.fn(() => {
                counter -= 1;
                return counter === 0;
            });

            tryTo('decrease counter', tesAction);
            expect(tesAction).toHaveBeenCalledTimes(1000);
            expect(counter).toEqual(0);
        });
        
        it('should throw an error if an action does not succeed after 1000 retries', () => {
            let counter = 1001;
            const tesAction = jest.fn(() => {
                counter -= 1;
                return counter === 0;
            });

            expect(() => tryTo('decrease counter', tesAction)).toThrow('Timeout while trying to decrease counter');
            expect(tesAction).toHaveBeenCalledTimes(1000);
            expect(counter).toEqual(1);
        });
    });

    describe('shuffle', () => {
        it('should not modify the original array', () => {
            const arr = [1, 2, 3, 4, 5];
            const newArr = shuffle(arr);
            expect(newArr).not.toBe(arr);
            expect(arr).toEqual([1, 2, 3, 4, 5]);
        });
        
        it('should return an array of the same length', () => {
            const arr = [1, 2, 3, 4, 5];
            const newArr = shuffle(arr);
            expect(newArr).toHaveLength(5);
        });
        
        it('should return an a new array with the same elements possibly in different order', () => {
            const arr = [1, 2, 3, 4, 5];
            const newArr = shuffle(arr);
            expect(newArr).toHaveLength(5);
            expect(newArr).toContainAllValues(arr);
        });
    });
});