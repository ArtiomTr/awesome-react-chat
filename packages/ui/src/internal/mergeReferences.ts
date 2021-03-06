import React from 'react';

export const mergeReferences = <T>(
    ...inputReferences: Array<React.Ref<T> | React.MutableRefObject<T> | undefined>
): React.Ref<T> | undefined => {
    const filteredInputReferences = inputReferences.filter(Boolean);

    if (filteredInputReferences.length <= 1) {
        return filteredInputReferences[0];
    }
    return function mergedReferences(reference: T | null) {
        for (const inputReference of filteredInputReferences) {
            if (typeof inputReference === 'function') {
                inputReference(reference);
            } else if (inputReference) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (inputReference as any).current = reference;
            }
        }
    };
};
