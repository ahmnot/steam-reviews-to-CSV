A data extractor from these review pages: <br> https://steamcommunity.com/app/439550/reviews/?browsefilter=mostrecent&snr=1_5_100010_&p=1&filterLanguage=all  <br>, which outputs the reviews to a nice CSV file. <br>

In order to make it work, you have to follow these steps: <br>
1 - Go to the inspector of the navigator on the previously said page. <br>
2 - Copy the content within the div which has the id="AppHubCards" inside an .html file. <br>
3 - Inside steamReviewsToCSV.js, point to the folder directory where you put the .html, in order for the .html file to be converted to .csv. <br>
4 - Run the program with node.
