//Wait fot the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  //importing the college list div and search button
  let collegeList = document.querySelector("#collegeList"); //Div for collgList
  let searchBtn = document.querySelector("#searchBtn");

  //declaring variables to store the state and country
  let country;
  let state;

  //adding event listner to the search button
  searchBtn.addEventListener("click", async () => {
    //get the country and state value from their respective inputs
    country = document.querySelector("#countryInp").value.toLowerCase();
    state = capitalizeFirstLetter(
      document.querySelector("#stateInp").value.toLowerCase()
    );

    //if both state and country are not provided
    if (!state && !country) {
      Swal.fire({
        title: "Enter Country or State",
        icon: "error",
      });
      return;
    }
    //if state is not provided, then state value becomes null
    if (!state) {
      state = "null";
    }
    //show a loading message sweet alert 2
    Swal.fire({
      imageUrl: "images/searching.gif",
      imageWidth: 200,
      imageHeight: 200,
      imageAlt: "Custom image",
      title: "Searching...",
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    //getting college data from API
    let colleges = await getCollege(country);

    //Filtering the arrived data based on state selected by user
    let filteredColleges =
      state !== "null"
        ? colleges.filter((coll) => coll["state-province"] === state)
        : colleges;
    //if no college found then show an error
    if (filteredColleges.length === 0) {
      Swal.fire({
        title: "No Colleges Found",
        text: "Check for Spelling mistakes",
        imageUrl: "images/not_found.gif",
        imageWidth: 150,
        imageHeight: 200,
        imageAlt: "Custom image",
      });
      return;
    }
    //clear the existing college list
    collegeList.innerHTML = "";
    //calling the fnc to show college list
    showCollegeList(filteredColleges);

    //after showing college close the loading message
    Swal.close();
  });

  //FUNCTION -  to fetch college from API
  async function getCollege(country) {
    const collegeAPI = `https://localhost:3001/getCollege?country=${country}`;
    try {
      let res = await axios.get(collegeAPI);
      return res.data;
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Data Not Found",
        icon: "error",
      });
    }
    return [];
  }
  //FUNCTION - to capitalize first letter - used for state
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  //Array for holding whole colleges data
  const collegesData = [];

  function showCollegeList(collList) {
    for (let coll of collList) {
      // Create college data object
      let collegeData = createCollegeData(coll);

      // Add college data to the array
      collegesData.push(collegeData);

      // Create college div
      let college = createCollegeDiv(collegeData);

      // Append college div to the college list
      collegeList.append(college);
    }
    saveAsCSV();
  }
  //function to create a college Data object
  function createCollegeData(coll) {
    return {
      flag: `https://flagsapi.com/${coll["alpha_two_code"]}/flat/64.png`,
      name: coll.name,
      state: coll["state-province"] === null ? "N/A" : coll["state-province"],
      web: `https://${coll.domains[0]}`,
    };
  }

  //FUNCTION - creating the main College Div
  function createCollegeDiv(collegeData) {
    let college = document.createElement("div");
    college.classList.add(
      "text-base",
      "md:text-3xl",
      "font-sans",
      "rounded-lg",
      "shadow-xl",
      "shadow-gray-800",
      "w-full",
      "px-4",
      "h-16",
      "bg-[#8D99AE]",
      "flex",
      "justify-evenly",
      "items-center",
      "gap-1",
      "even:bg-[#EDF2F4]"
    );

    // Create and append country flag
    let countryFlag = createCountryFlag(collegeData.flag);
    college.appendChild(countryFlag);

    // Create and append college name
    let collegeName = createCollegeName(collegeData.name);
    college.appendChild(collegeName);

    // Create and append college state
    let collegeState = createCollegeState(collegeData.state);
    college.appendChild(collegeState);

    // Create and append college web
    let collegeWeb = createCollegeWeb(collegeData.web);
    college.appendChild(collegeWeb);

    return college;
  }

  //FUNCTION - create country flag div and img
  function createCountryFlag(flagUrl) {
    let countryFlag = document.createElement("div");
    countryFlag.classList.add("w-12", "h-11");
    let flagImg = document.createElement("img");
    flagImg.src = flagUrl;
    flagImg.alt = "countryFlag";
    flagImg.classList.add("w-full", "h-full", "rounded-full");
    countryFlag.appendChild(flagImg);
    return countryFlag;
  }
  //FUNCTION college name div
  function createCollegeName(name) {
    let collegeName = document.createElement("div");
    collegeName.innerText = name;
    collegeName.classList.add(
      "w-48",
      "md:w-full",
      "text-center",
      "md:text-3xl"
    );
    return collegeName;
  }
  //FUNCTION - create college state
  function createCollegeState(state) {
    let collegeState = document.createElement("div");
    collegeState.classList.add(
      "w-20",
      "md:w-3/12",
      "md:text-3xl",
      "flex",
      "justify-center",
      "items-center",
      "gap-1"
    );
    let stateIcon = document.createElement("i");
    stateIcon.classList.add("fa-lg", "fa-solid", "fa-location-dot");
    collegeState.appendChild(stateIcon);

    let stateText = document.createElement("div");
    stateText.classList.add("md:text-3xl");
    stateText.innerText = state;
    collegeState.appendChild(stateText);
    return collegeState;
  }

  function createCollegeWeb(webUrl) {
    let webIcon = document.createElement("i");
    webIcon.classList.add("fa-xl", "fa-solid", "fa-globe");
    let webAnchor = document.createElement("a");
    webAnchor.setAttribute("href", webUrl);
    webAnchor.target = "_blank";
    webAnchor.appendChild(webIcon);

    let collegeWeb = document.createElement("div");
    collegeWeb.classList.add("w-12", "flex", "items-center", "justify-center");
    collegeWeb.appendChild(webAnchor);
    return collegeWeb;
  }
  //FUNCTION - to create a CSV
  function saveAsCSV() {
    // Create a new button element
    let saveCsvBtn = document.createElement("button");

    // Add classes to the button for styling
    saveCsvBtn.classList.add(
      "text-lg",
      "font-sans",
      "font-medium",
      "cursor-pointer",
      "group",
      "relative",
      "flex",
      "gap-1.5",
      "px-8",
      "py-4",
      "bg-[#E8F0FE]",
      "text-[#FF4444]",
      "rounded-3xl",
      "hover:bg-opacity-70",
      "transition",
      "font-semibold",
      "shadow-md"
    );

    // Set the inner HTML of the button to include the text and SVG icon
    saveCsvBtn.innerHTML = `
      Save as CSV
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24px" width="24px">
        <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
        <g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>
        <g id="SVGRepo_iconCarrier">
          <g id="Interface / Download">
            <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="#FF4444" d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12" id="Vector"></path>
          </g>
        </g>
      </svg>
    `;

    //event listner for save as CSV button
    saveCsvBtn.addEventListener("click", () => {
      // Initialize the CSV content with the appropriate data type and charset
      let csvContent = "data:text/csv;charset=utf-8,";

      // Add the header row to the CSV content
      let headerRow = "Country,Country flag, Name,State,Web";
      csvContent += headerRow + "\r\n";

      // Loop through the collegesData array and add each row to the CSV content
      collegesData.forEach(function (rowArray) {
        let row = [country, ...Object.values(rowArray)].join(",");
        csvContent += row + "\r\n";
      });

      // Encode the CSV content as a URI
      const encodedUri = encodeURI(csvContent);

      // Create a new anchor element and set its href attribute to the encoded URI
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `CollegeScope-${country}-${state}.csv`);

      // Append the anchor element to the body (required for Firefox)
      document.body.appendChild(link);

      // Simulate a click on the anchor element to start the download
      link.click();

      // Remove the anchor element from the body
      document.body.removeChild(link);
    });

    // Append the button to the collegeList element
    collegeList.appendChild(saveCsvBtn);
  }
});
