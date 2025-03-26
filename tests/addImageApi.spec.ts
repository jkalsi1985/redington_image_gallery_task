import { test, expect } from '@playwright/test';
import { AddImage, GetImage, DeleteImage, GetAllImages } from '@/components/Helper/Api';
import { ImageGalleryPage } from './support/imageGalleryPage';
import { addImageData } from './support/fixture/apiData';


test.describe('Image Gallery API E2E Flow', () => {
  const titleVal = Math.random().toString(36).substring(2, 10);
  let imageId: string;

  test.beforeEach(async () => {

    await test.step('Create an image via API', async () => {
      const addImagePayload = addImageData(titleVal);
      const addImageResponse = await AddImage(addImagePayload);
  
      expect(addImageResponse).toBeDefined();
      imageId = addImageResponse.id;
    });

    await test.step('Get image via API and check it exist', async () => {
      const getImageResp = await GetImage('Automation');
      expect(getImageResp).toBeDefined();
      expect(getImageResp.length).toBeGreaterThan(0);
      expect(getImageResp[0].id).toBe(imageId);
    });
  });

  test('should be able to add and delete image to gallary via API successfully', async ({ page }) => {
    const imageGallery = new ImageGalleryPage(page);
  
    await test.step('Navigate to Image Gallery site', async () => {
      await imageGallery.navigateToImageGallerySite();
      await imageGallery.verifyCountOfImageList(4);
    });

    await test.step('Validate the current count of image list', async () => {
      await imageGallery.verifyCountOfImageList(4);
    });

    await test.step('Search by title', async () => {
      await imageGallery.searchByTitle(titleVal);
    });
  
    await test.step('Verify the keywords exist and filter by keyword Automation', async () => {
      await imageGallery.verifyKeywordsExistInDropDownMenu(['Automation', 'QA', 'Sun']);
      await imageGallery.filterByKeyword('Automation');
    });
  
    await test.step('Verify image result list', async () => {
      await imageGallery.verifyCountOfImageList(1);
      await imageGallery.verifyImageListItemTitle(titleVal);
      await imageGallery.verifyImageListItemSubTitle('keywords: Automation,QA,Sun');
    });

    // TODO (Bug): Unable to select another keyword option from the menu
    await test.step.skip('Search by title and filter by keyword QA', async () => {
      await imageGallery.searchByTitle(titleVal);
      await imageGallery.verifyKeywordsExistInDropDownMenu(['Automation', 'QA', 'Sun']);
      await imageGallery.filterByKeyword('QA');
    });

    await test.step.skip('Verify image result list', async () => {
      await imageGallery.verifyCountOfImageList(1);
      await imageGallery.verifyImageListItemTitle(titleVal);
      await imageGallery.verifyImageListItemSubTitle('keywords: Automation,QA,Sun');
    });
  
    await test.step('Delete image ID and verify image is removed from the list via API', async () => {
      const deleteImageResp = await DeleteImage(imageId);
      expect(deleteImageResp.status).toBe(200);
  
      const allImages = await GetAllImages();
      const foundImage = allImages.find((img) => img.Id === imageId);
      expect(foundImage).toBeUndefined();
    });
  
    await test.step('Refresh the image gallary site', async () => {
      await imageGallery.navigateToImageGallerySite();
    });

    await test.step('Validate the new image list decrease by 1', async () => {
      await imageGallery.verifyCountOfImageList(3);
    });

    await test.step('Verify image is no longer visible in the gallary UI', async () => {
      await imageGallery.searchByTitle(titleVal);
      await imageGallery.verifyCountOfImageList(0);
    });
  
    await test.step('Verify keywords are no longer exist in dropdown menu', async () => {
      await imageGallery.elements.filterDropDownBtn.click();
      await expect(await page.getByRole('option', { name: 'Automation' })).not.toBeVisible();
      await expect(await page.getByRole('option', { name: 'QA' })).not.toBeVisible();
      await expect(await page.getByRole('option', { name: 'Sun' })).not.toBeVisible();
    });
  });
});
