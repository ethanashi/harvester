# Harvester

Harvester is a robust email extraction tool designed to extract and clean email addresses from various sources using keywords. This tool leverages the power of SerpAPI to scrape search results, providing a rich dataset to filter through and extract email addresses from.

## Features:

- Extract emails using specific keyword libraries.
- Clean duplicates in the email lists.
- Provides a choice to overwrite or create a new cleaned list.
- Ability to shuffle and randomize the order of keywords for varied results.
- Support for multiple SerpAPI keys to increase the volume of searches.

## Getting Started:

### Prerequisites:

Ensure that you have Node.js installed on your system. If not, you can download it from [here](https://nodejs.org/).

### Installation:

1. Clone the repository:

```
git clone https://github.com/ethanashi/harvester.git
```

2. Navigate to the cloned directory:

```
cd harvester
```

3. Install the required packages:

```
npm install
```

### Usage:

1. Start the application:

```
node search.js
```

2. Follow the on-screen prompts to select the desired operation:
    - Harvest Emails
    - Clean Duplicates in Email Lists
    - Quit

3. For "Harvest Emails":
    - Choose a keyword library.
    - Provide a name for the CSV file where results will be saved.
    - Watch as the program harvests emails and logs the progress.

4. For "Clean Duplicates in Email Lists":
    - Choose a CSV file to clean.
    - Decide whether to overwrite the file or create a new cleaned one.

5. Once completed, the program will display the number of emails harvested or cleaned.

### API Keys:

The tool uses SerpAPI to fetch results. Ensure that you have your API keys saved in `API-Keys/Serp-API-Keys.txt`.

### Contributing:

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

### License:

This project is licensed under the MIT License.

---

Made with ❤️ by [Ethan Ashi]
