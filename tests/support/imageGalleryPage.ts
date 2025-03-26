import { Page, Locator, expect } from '@playwright/test';

export class ImageGalleryPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get elements() {
    return {
      searchField: this.page.getByRole('textbox', { name: 'Search' }),
      filterDropDownBtn: this.page.getByRole('combobox'),
      startDateField: this.page.getByRole('textbox', { name: 'Start Date' }),
      endDateField: this.page.getByRole('textbox', { name: 'End Date' }),
      imageListItems: this.page.locator('.MuiImageListItem-img'),
      imageResultTitle: this.page.locator('.MuiImageListItemBar-title.css-1sdhmys-MuiImageListItemBar-title'),
      imageResultSubtitle: this.page.locator('.MuiImageListItemBar-subtitle.css-12mqd3t-MuiImageListItemBar-subtitle'),

      // Add image Form
      addImageBtn: this.page.getByRole('button', { name: 'Add Image' }),
      formTitleField: this.page.getByRole('textbox', { name: 'Title' }),
      formUrlField: this.page.getByRole('textbox', { name: 'Url' }),
      formKeywordField: this.page.getByRole('textbox', { name: 'Keywords' }),
      formStartDateField: this.page.getByRole('textbox', { name: 'Date' }),
      submitBtn: this.page.getByRole('button', { name: 'Submit' }),
    };
  }

  async navigateToImageGallerySite() {
    await this.page.goto('http://localhost:3000/');
    await expect(this.page).toHaveTitle(/Create Next App/);
  }

  async fillImageForm(title: string, url: string, keyword: string[], startDate: string) {
    await this.elements.addImageBtn.click();

    await this.elements.formTitleField.click();
    await this.elements.formTitleField.fill(title);

    await this.elements.formUrlField.click();
    await this.elements.formUrlField.fill(url);

    await this.elements.formKeywordField.click();
    await this.elements.formKeywordField.fill(keyword.join(', '));

    await this.elements.formStartDateField.click();
    await this.elements.formStartDateField.fill(startDate);

    await this.elements.submitBtn.click();
  }

  async searchByTitle(title: string) {
    await this.elements.searchField.click();
    await this.elements.searchField.fill(title);
  }

  async fillInStartDate(date: string) {
    await this.elements.startDateField.click();
    await this.elements.startDateField.fill(date);
  }

  async fillInEndDate(date: string) {
    await this.elements.endDateField.click();
    await this.elements.endDateField.fill(date);
  }

  async filterByKeyword(keyword: string) {
    await this.page.getByRole('option', { name: keyword }).click();

    // Click on outside of drop down menu in order to close the menu
    await this.page.locator('#menu- div').first().click();  
 }

 async verifyKeywordsExistInDropDownMenu(keywords: string[]) {
  await this.elements.filterDropDownBtn.click();
    for (const keyword of keywords) {
      const option = this.page.getByRole('option', { name: keyword });
      await expect(option).toBeVisible();
    }
 }
 
  async verifyCountOfImageList(expectedCount: number) {
    await expect(this.elements.imageListItems).toHaveCount(expectedCount);
  }

  async verifyImageListItemTitle(expectedTitle: string) {
    await expect(this.elements.imageResultTitle).toHaveText(expectedTitle);
  }

  async verifyImageListItemSubTitle(expectedSubtitle: string) {
    await expect(this.elements.imageResultSubtitle).toHaveText(expectedSubtitle);
  }
}
