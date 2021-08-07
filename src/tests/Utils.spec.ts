import { flatten, tryTo } from '../Util';

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
});