
import { ImageTypeRequest } from '@/components/Helper/ImageConsts';

export const addImageData = (titleVal: string): ImageTypeRequest => {
    return {
        title: titleVal,
        image: 'https://fastly.picsum.photos/id/29/4000/2670.jpg?hmac=rCbRAl24FzrSzwlR5tL-Aqzyu5tX_PA95VJtnUXegGU',
        keywords: ['Automation', 'QA', 'Sun'],
        uploadDate: new Date('2022-02-22T00:00:00.000Z'),
    };
};