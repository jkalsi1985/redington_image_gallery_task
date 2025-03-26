## Description
The purpose of this task is to implement E2E automation test framework using playwright for image Gallery using both UI and API provided in swagger doc

The project was implement on a Mac using Playwright in Typescript.

## Requirements on mac 
- Node.js 18.18 or later
- `npm install` to install the dependcies and check you can access http://localhost:3000/
- `npm run playwright` - to run the tests

Please note: `npm run playwright` you have to run as individual test. If you run whole suite the 2nd test will fail due to it thinks image list count is 4 but GetAllImages() it shows 3 items it could be possibly a bug.

## Optional to test for flakiness and run whole suite which will pass.

Run `npx playwright test tests/addImageToUi.spec.ts && npx playwright test tests/addImageApi.spec.ts --repeat-each=3`

## Bugs found in API

1. `POST /api/images` - the swagger doc example needs updating and error message needs to improve
it should only state which fields I'm missing.

I've checked OpenAPI specification and doesn't specify it needs upload date therefore, had to go through GetAllImages() and view the data to get API working.

```
{
  "title": "jag_test",
  "image": "https://fastly.picsum.photos/id/24/4855/1803.jpg?hmac=ICVhP1pUXDLXaTkgwDJinSUS59UWalMxf4SOIWb9Ui4",
  "keywords": [
    "test_jag"
  ]
}
```
Response:

```
{
  "error": "Missing title, image, keywords or upload date"
}
```

2. When add "id" to the POST request it doesn't show correctly in the GetAllImages() response for example:

`POST /api/images`

```
{
    "id": "1234",
    "title": "Book",
    "image": "https://fastly.picsum.photos/id/24/4855/1803.jpg?hmac=ICVhP1pUXDLXaTkgwDJinSUS59UWalMxf4SOIWb9Ui4",
    "keywords": [
        "book",
        "study", 
        "pages"
    ],
    "uploadDate": "2021-01-01T00:00:00.000Z"
}
```
The response showed correctly setting the `id: "1234"`. However, when view `GetAllImages()` the id shows differently:

```
{"id":"data_id_5","title":"Book","image":"https://fastly.picsum.photos/id/24/4855/1803.jpg?hmac=ICVhP1pUXDLXaTkgwDJinSUS59UWalMxf4SOIWb9Ui4","keywords":["book","study","pages"],"uploadDate":"2021-01-01T00:00:00.000Z"}
```

## Bugs found on UI
1. None of the elements had data-testid which will fail accessability validation
2. When select one keyword, user unable to select another
3. When select one keyword it doesn't close the drop down menu, hence in E2E I had to click outside the drop down menu to avoid flaky test
4. When user add image via UI, the keywords added doesn't show in drop down menu and in API keyword list is empty
5. Add image with missing fields, no valid error message is shown

## Comment and Improvements
1. Full E2E including UI is expensive, detect backend issue early integration tests.
2. Check error handling in UI would be cover as unit test.
3. Applied `@axe-core/playwright ` scan image gallary page for automatically detectable accessibility violations
4. In `addImageApi.spec` applied checks before calling API the total count image list
5. Investigate the issue while running playwright with missing fields it adds the image while testing it manually it doesn't.
6. Apply @smoke tag to the tests ie '@smoke Image Gallery Tests'
7. Investigate by 2nd test and think there's 4 images in the list as GetAllImages() shows there 3.
