import { test, expect } from '@playwright/test';
import { ImageGalleryPage } from './support/imageGalleryPage';
import { DeleteImage, GetAllImages } from '@/components/Helper/Api';
import { getFormattedDate } from "./support/utils/dateUtils";

test.describe.configure({ mode: 'serial' });

test.describe('Image Gallery UI E2E Flow', () => {
  const titleVal = Math.random().toString(36).substring(2, 10);
  const yesterdayDate = getFormattedDate(-1);
  const tomorrowDate = getFormattedDate(1);
  let imageGallery: ImageGalleryPage;
    
  test.beforeEach(async ({ page, context }) => {
    await test.step('Clear the cookies', async () => {
        await context.clearCookies();
    });

    await test.step('Go to Image Gallery site', async () => {
        imageGallery = new ImageGalleryPage(page);
        await imageGallery.navigateToImageGallerySite();
    });
  });

  test.afterEach(async ({ page }) => {
    imageGallery = new ImageGalleryPage(page);

    await test.step('Find and delete the image ID via API', async () => {
        // Find the image ID match to title
        const allImagesData = await GetAllImages();
        const matchingImage = allImagesData.find((img) => img.Title === titleVal);

        expect(matchingImage).toBeDefined();
        const imageId = matchingImage!.Id;

        // Delete the image
        const deleteResp = await DeleteImage(imageId);
        expect(deleteResp.status).toBe(200);
    });
  });

  test('should be able to add image successfully via the UI', async () => {

    await test.step('Validate current total count in image list', async () => {
        await imageGallery.verifyCountOfImageList(3);
    });

    await test.step('Fill in image form', async () => {
        await imageGallery.fillImageForm(
            titleVal,
            'https://fastly.picsum.photos/id/24/4855/1803.jpg?hmac=ICVhP1pUXDLXaTkgwDJinSUS59UWalMxf4SOIWb9Ui4',
            ['QA', 'Book', 'pages', 'Automation'],
            yesterdayDate,
        );    
    });

    await test.step('Validate new total count in image list', async () => {
        await imageGallery.verifyCountOfImageList(4);
    });

    await test.step('Filter the title', async () => {
        await imageGallery.searchByTitle(titleVal);  
    });

    await test.step('Filter the start date', async () => {
        await imageGallery.fillInStartDate(yesterdayDate);  
    });

    await test.step('Filter the end date', async () => {
        await imageGallery.fillInEndDate(tomorrowDate);  
    });

    // TODO (Bug): keyword added via form does not exist in drop down menu
    await test.step.skip('Verify the keyword exist in menu', async () => {
        await imageGallery.verifyKeywordsExistInDropDownMenu(['QA', 'Book', 'pages', 'Automation']);
    });

    await test.step('Verify the result', async () => {
        await imageGallery.verifyCountOfImageList(1);
        await imageGallery.verifyImageListItemTitle(titleVal);
        // Bug: keyword not added via the UI
        // await imageGallery.verifyImageListItemSubTitle("keywords: QA"); 
    });
  });

  // TODO (Bug): Added to the gallary when form not filled in when running the test.
  test.skip('attempt to fill form without anything filled in', async () => {

    await test.step('Validate total count in image list', async () => {
        await imageGallery.verifyCountOfImageList(3);
    });

    await test.step('Add image without any fields filled in the form and validate not added to the list', async () => {
        await imageGallery.fillImageForm(
            '',
            '',
            [''],
            '',
        ); 
        
        await imageGallery.verifyCountOfImageList(3);
    });
  });
});
