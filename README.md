This is a data extractor that extracts data from these type of review pages: <br> https://steamcommunity.com/app/439550/reviews/?browsefilter=mostrecent&snr=1_5_100010_&p=1&filterLanguage=all

It outputs the reviews to a nice CSV file. 

In order to make it work, follow these steps: 

1 - Go to the inspector of the navigator on the previously said page.

2 - Copy the content within the div which has the id="AppHubCards" inside an .html file.

3 - Inside steamReviewsToCSV.js, point to the folder directory where you put the .html, in order for the .html file to be converted to .csv.

4 - Run the program with node.
