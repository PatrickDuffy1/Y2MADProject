import { Injectable } from '@angular/core';

// Array of country names.
const countries: string[] = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Angola",
    "Argentina",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bosnia And Herzegovina",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina fasco",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cape Verde",
    "Cayman Islands",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Costa Rica",
    "Côte d'Ivoire",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican republic",
    "DR Congo",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Estonia",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "French Polynesia",
    "Gabon",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Guatemala",
    "Guinea",
    "Haiti",
    "Honduras",
    "Hong kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kuwait",
    "Kyrgyzstan",
    "Latvia",
    "Lebanon",
    "Libya",
    "Lithuania",
    "Luxembourg",
    "Macau",
    "Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Mauritania",
    "Mexico",
    "Moldova",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nepal",
    "Netherland",
    "New zealand",
    "Niger",
    "Nigeria",
    "North korea",
    "Norway",
    "Oman",
    "Pakistan",
    "Panama",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Puerto rico",
    "Romania",
    "Russia",
    "Rwanda",
    "Samoa",
    "San Marino",
    "Saudi arabia",
    "Senegal",
    "Serbia",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South africa",
    "South korea",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Tonga",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Uganda",
    "Ukraine",
    "United arab emirates",
    "United kingdom",
    "United states of america",
    "Uruguay",
    "Uzbekistan",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
];

// Array of country codes.
const countryCodes: string[] = [
    "af",
    "al",
    "dz",
    "ao",
    "ar",
    "au",
    "at",
    "az",
    "bh",
    "bd",
    "bb",
    "by",
    "be",
    "bm",
    "bt",
    "bo",
    "ba",
    "br",
    "bn",
    "bg",
    "bf",
    "kh",
    "cm",
    "ca",
    "cv",
    "ky",
    "cl",
    "cn",
    "co",
    "km",
    "cr",
    "ci",
    "hr",
    "cu",
    "cy",
    "cz",
    "dk",
    "dj",
    "dm",
    "do",
    "cd",
    "ec",
    "eg",
    "sv",
    "ee",
    "et",
    "fj",
    "fi",
    "fr",
    "pf",
    "ga",
    "ge",
    "de",
    "gh",
    "gr",
    "gt",
    "gn",
    "ht",
    "hn",
    "hk",
    "hu",
    "is",
    "in",
    "id",
    "iq",
    "ie",
    "il",
    "it",
    "jm",
    "jp",
    "jo",
    "kz",
    "ke",
    "kw",
    "kg",
    "lv",
    "lb",
    "ly",
    "lt",
    "lu",
    "mo",
    "mk",
    "mg",
    "mw",
    "my",
    "mv",
    "ml",
    "mt",
    "mr",
    "mx",
    "md",
    "mn",
    "me",
    "ma",
    "mz",
    "mm",
    "na",
    "np",
    "nl",
    "nz",
    "ne",
    "ng",
    "kp",
    "no",
    "om",
    "pk",
    "pa",
    "py",
    "pe",
    "ph",
    "pl",
    "pt",
    "pr",
    "ro",
    "ru",
    "rw",
    "ws",
    "sm",
    "sa",
    "sn",
    "rs",
    "sg",
    "sk",
    "si",
    "sb",
    "so",
    "za",
    "kr",
    "es",
    "lk",
    "sd",
    "se",
    "ch",
    "sy",
    "tw",
    "tj",
    "tz",
    "th",
    "to",
    "tn",
    "tr",
    "tm",
    "ug",
    "ua",
    "ae",
    "gb",
    "us",
    "uy",
    "uz",
    "ve",
    "vi",
    "ye",
    "zm",
]

// Array of the four default country's names.
const shortCountriesList: string[] = [
    "Australia",
    "Ireland",
    "United Kingdom",
    "United States"
]

// Array of the four default country's codes.
const shortCountryCodesList: string[] = [
    "au",
    "ie",
    "gb",
    "us"
]

@Injectable({
    providedIn: 'root'
})
export class CountriesService 
{
    constructor() { }

    getCountriesList() 
    {
        return countries;
    }

    getCountryCodesList() 
    {
        return countryCodes;
    }

    getShortCountriesList() 
    {
        return shortCountriesList;
    }

    getShortCountryCodesList() 
    {
        return shortCountryCodesList;
    }

    getIndexByCountryCode(countryCode: string) 
    {
        let index = -1;

        for (let i = 0; i < countryCodes.length; i++) 
        {
            if (countryCode == countryCodes[i]) 
            {
                index = i;
            }
        }

        return index;
    }

    getCountryNameByCountryCode(countryCode: string) 
    {
        let countryName: string = "";

        for (let i = 0; i < countries.length; i++) 
        {
            if (countryCode == countryCodes[i]) 
            {
                countryName = countries[i];
                break;
            }
        }

        return countryName;
    }

    setShortListFromCountryIndex(index: number) 
    {
        let shortListCountryIndex = -1;

        for (let i = 0; i < shortCountriesList.length; i++) 
        {
            if (countryCodes[index] == shortCountryCodesList[i]) 
            {
                shortListCountryIndex = i;
                break;
            }
        }

        return shortListCountryIndex;
    }

    setCountryIndexFromShortList(index: number) 
    {
        let countryIndex = -1;

        for (let i = 0; i < countries.length; i++) 
        {
            if (shortCountryCodesList[index] == countryCodes[i]) 
            {
                countryIndex = i;
                break;
            }
        }

        return countryIndex;
    }
}
