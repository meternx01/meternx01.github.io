# Walmart Exercise


This Android application is designed to read and display information from a network hosted JSON file. The app retrieves the JSON data using `retrofit2` and parses the JSON data using `gson-converter` presents it in a user-friendly interface using a `RecyclerView`.

## Requirements
- Consume the JSON file from a web resource [here](https://gist.githubusercontent.com/peymano-wmt/32dcb892b06648910ddd40406e37fdab/raw/db25946fd77c5873b0303b858e861ce724e0dcd0/countries.json)
    - Use Coroutines
- Display the information in a RecyclerView ordered on how they appear in the JSON
    - Name of the Country
    - Region Identifier
    - Country Code
    - Capital City
    ``` 
  --------------------------------------- 
  |                                     | 
  | United States of America, NA     US | 
  |                                     | 
  | Washington, D.C.                    | 
  |                                     | 
  --------------------------------------- 
  |                                     | 
  | Uruguay, SA                      UY | 
  |                                     | 
  | Montevideo                          | 
  |                                     |
  --------------------------------------- 

- Avoid using the following
    - Jetpack Compose
    - Dagger / Hilt

## Solution
This is a Kotlin based Android Native app that reads in [this JSON](https://gist.githubusercontent.com/peymano-wmt/32dcb892b06648910ddd40406e37fdab/raw/db25946fd77c5873b0303b858e861ce724e0dcd0/countries.json) and displays the information in a RecyclerView.

Use of the following:
- Retrofit to read from the web resource
- Retrofit's GSON converter to parse the incoming JSON
- Standard RecyclerView with Adapter
- Error Handling and notifications using Toast for different error conditions
  - Network Errors
  - HTTP Errors (non 200 status codes)
  - Miscellaneous Errors

## Limitations and Possible Improvements

Due to the consolidated time window to produce this app, I have identified a few improvements

- **Add Repository Pattern**: The app currently implements the Retrofit Instance directly in my ViewModel. 
  - Using a Repository would allow more extensibility for later enhancements such as RoomDB persistence, other data sources, and better testing access.
- **More Error Handling**: Currently the app finds exceptions in the retrieval of the web resource. Other enhancements may include checking for connectivity, then advising before the request is made rather than reacting to the error in the result.
  - Such as using `ConnectivtyManager`
- **Field Validation**: Some countries have no capital city. Add conditions for filling in capital city or an exception.
  - They seem to be territories, e.g. *United States Minor Outlying Islands*, which would default to *Washington D.C*  
- **Implement Unit Testing**: Add unit tests to ensure the JSON parsing and data handling logic is robust and error-free.
