//Wait fot the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  //importing the college list div and search button
  let collegeList = document.querySelector("#collegeList"); //Div for collgList
  let searchBtn = document.querySelector("#searchBtn");

  //declaring variables to store the state and country
  const state = document
    .getElementById("dropdown-menu")
    .addEventListener("click", function (event) {
      event.target;
    });

  console.log(state);
  //adding event listner to the search button
  searchBtn.addEventListener("click", async () => {
    //get the country and state value from their respective inputs
    state = capitalizeFirstLetter(
      document.querySelector("#stateInp").value.toLowerCase()
    );
    district = capitalizeFirstLetter(
      document.querySelector("#districtInp").value.toLowerCase()
    );
    console.log(state);
    console.log(district);

    //if both state and country are not provided
    if (!state && !district) {
      Swal.fire({
        title: "Enter State and District",
        icon: "error",
      });
      return;
    }

    //show a loading message sweet alert 2
    // Swal.fire({
    //   imageUrl: "images/searching.gif",
    //   imageWidth: 200,
    //   imageHeight: 200,
    //   imageAlt: "Custom image",
    //   title: "Searching...",
    //   allowOutsideClick: false,
    //   showConfirmButton: false,
    //   willOpen: () => {
    //     Swal.showLoading();
    //   },
    // });

    //getting college data from API
    let colleges = await getCollege(state, district);

    //clear the existing college list
    collegeList.innerHTML = "";
    //calling the fnc to show college list
    showCollegeList(colleges);

    //after showing college close the loading message
    Swal.close();
  });

  //FUNCTION -  to fetch college from API
  // async function getCollege(country) {
  //   const collegeAPI = `http://localhost:3001/getCollege?country=${country}`;
  //   try {
  //     let res = await axios.get(collegeAPI);
  //     return res.data;
  //   } catch (error) {
  //     console.log(error);
  //     Swal.fire({
  //       title: "Data Not Found",
  //       icon: "error",
  //     });
  //   }
  // }

  // FUNCTION -  to fetch college from API
  async function getCollege(state, district) {
    const collegeAPI = `http://localhost:3001/getCollege?state=${state}&district=${district}`;
    try {
      let res = await axios.get(collegeAPI);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Data Not Found",
        icon: "error",
      });
    }
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
    let splitName = coll["College Name"].split(" (Id:");
    let collegeName = splitName[0];
    return {
      name: collegeName,
      district: coll["District Name"],
      state: coll["State Name"],
      type: coll["College Type"],
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
      "px-3",
      // "h-16",
      "bg-[#8D99AE]",
      "flex",
      "flex-col",
      "md:flex-row",
      "justify-around",
      "items-center",
      "gap-1",
      "even:bg-[#EDF2F4]"
    );

    // Create and append college name
    let collegeName = createCollegeName(collegeData.name);
    college.appendChild(collegeName);

    //Create and append college type
    let collegeType = createCollegeType(collegeData.type);
    college.appendChild(collegeType);

    // Create and append college state
    let collegeLocation = createCollegeLocation(
      collegeData.district,
      collegeData.state
    );
    college.appendChild(collegeLocation);

    return college;
  }

  //FUNCTION college name div
  function createCollegeName(name) {
    // Create the main div
    let collegeNameDiv = document.createElement("div");
    collegeNameDiv.id = "collegeName";
    collegeNameDiv.classList.add(
      "text-center",
      "justify-center",
      "items-center",
      "font-bold",
      "flex",
      "md:w-8/12"
    );

    // Create the collegeIcon Div
    let collegeIconDiv = document.createElement("div");
    collegeIconDiv.id = "collegeIcon";
    collegeIconDiv.classList.add(
      // "w-28",
      "md:w-1/4",
      "h-14",
      "hidden",
      "justify-center",
      "items-center",
      "md:flex"
    );

    // Create the i element
    let iElement = document.createElement("i");
    iElement.classList.add("fa-solid", "fa-graduation-cap", "fa-lg");
    collegeIconDiv.appendChild(iElement);

    // Create the nameText div
    let nameTextDiv = document.createElement("div");
    nameTextDiv.classList.add("nameText", "w-full");
    nameTextDiv.innerText = name;

    // Append the countryFlag and nameText divs to the main div
    collegeNameDiv.appendChild(collegeIconDiv);
    collegeNameDiv.appendChild(nameTextDiv);

    return collegeNameDiv;
  }
  //FUNCTION  - createCollegeType
  function createCollegeType(type) {
    let collegeType = document.createElement("div");
    collegeType.id = "collegeType";
    collegeType.classList.add(
      "md:w-3/12",
      "flex",
      "md:gap-4",
      "items-center",
      "justify-center",
      "gap-2",
      "italic"
    );

    let typeIcon = document.createElement("i");
    typeIcon.classList.add("fa-solid", "fa-school-circle-check", "fa-lg");
    collegeType.appendChild(typeIcon);

    let typeText = document.createElement("div");
    typeText.classList.add("text-center", "flex", "justify-center");
    typeText.id = "stateText";
    typeText.innerText = type;
    collegeType.appendChild(typeText);

    return collegeType;
  }

  function createCollegeLocation(district, state) {
    let collegeLocation = document.createElement("div");
    collegeLocation.id = "collegeLocation";
    collegeLocation.classList.add(
      "md:w-3/12",
      "flex",
      "gap-1",
      "justify-center",
      "italic",
      "items-center"
    );

    let locationIcon = document.createElement("i");
    locationIcon.classList.add("fa-lg", "fa-solid", "fa-location-dot");
    collegeLocation.appendChild(locationIcon);

    let locationText = document.createElement("div");
    locationText.id = "stateText";
    locationText.classList.add("text-center", "flex", "justify-center");
    locationText.innerText = district + ", " + state;
    collegeLocation.appendChild(locationText);

    return collegeLocation;
  }

  //FUNCTION - to create a CSV
  function saveAsCSV() {
    // Create a new button element
    let saveCsvBtn = document.createElement("button");

    // Add classes to the button for styling
    saveCsvBtn.classList.add(
      "text-xl",
      "font-sans",
      "font-bold",
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
