document.addEventListener("DOMContentLoaded", function () {
  let collegeList = document.querySelector("#collegeList"); //Div for collgList
  let searchBtn = document.querySelector("#searchBtn");

  searchBtn.addEventListener("click", async () => {
    let country = document.querySelector("#countryInp").value.toLowerCase();
    let state = capitalizeFirstLetter(
      document.querySelector("#stateInp").value.toLowerCase()
    );
    if (!state && !country) {
      Swal.fire({
        title: "Enter Country or State",
        icon: "error",
      });
      return;
    }
    if (!state) {
      state = "null";
    }

    Swal.fire({
      imageUrl: "searching.gif",
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
    console.log("btn clicked");
    console.log(country);

    let colleges = await getCollege(country);

    let filteredColleges =
      state !== "null"
        ? colleges.filter((coll) => coll["state-province"] === state)
        : colleges;
    if (filteredColleges.length === 0) {
      Swal.fire({
        title: "No Colleges Found",
        text: "Check for Spelling mistakes",
        imageUrl: "not_found.gif",
        imageWidth: 150,
        imageHeight: 200,
        imageAlt: "Custom image",
      });
      return;
    }
    collegeList.innerHTML = "";
    showCollegeList(filteredColleges);
    Swal.close();
  });

  async function getCollege(country) {
    const collegeAPI = `http://universities.hipolabs.com/search?country=${country}`;
    try {
      let res = await axios.get(collegeAPI);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  //Array for holding whole colleges data
  const collegesData = [];

  function showCollegeList(collList) {
    for (coll of collList) {
      let collegeData = {
        flag: `https://flagsapi.com/${coll["alpha_two_code"]}/flat/64.png`,
        name: coll.name,
        state: coll["state-province"] === null ? "N/A" : coll["state-province"],
        web: `https://${coll.domains[0]}`,
      };
      collegesData.push(collegeData);
      //College Div
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

      //Country Flag
      let countryFlag = document.createElement("div");
      countryFlag.classList.add("w-12", "h-11");
      let flagImg = document.createElement("img");
      flagImg.src = collegeData.flag;
      flagImg.alt = "countryFlag";
      flagImg.classList.add("w-full", "h-full", "rounded-full");

      countryFlag.appendChild(flagImg);
      college.appendChild(countryFlag);

      //College Name
      let collegeName = document.createElement("div");
      collegeName.innerText = collegeData.name;
      collegeName.classList.add(
        "w-48",
        "md:w-full",
        "text-center",
        "md:text-3xl"
      );

      college.appendChild(collegeName);

      //College State
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
      stateText.innerText = collegeData.state;
      collegeState.appendChild(stateText);
      college.appendChild(collegeState);

      //College Web
      let webIcon = document.createElement("i");
      webIcon.classList.add("fa-xl", "fa-solid", "fa-globe");
      let webAnchor = document.createElement("a");
      webAnchor.setAttribute("href", collegeData.web);
      webAnchor.target = "_blank";
      webAnchor.appendChild(webIcon);

      let collegeWeb = document.createElement("div");
      collegeWeb.classList.add(
        "w-12",
        "flex",
        "items-center",
        "justify-center"
      );
      collegeWeb.appendChild(webAnchor);
      college.appendChild(collegeWeb);

      collegeList.append(college);
    }
    saveAsCSV();
  }

  function saveAsCSV() {
    let saveCsvBtn = document.createElement("button");
    saveCsvBtn.classList.add(
      "cursor-pointer",
      "group",
      "relative",
      "flex",
      "gap-1.5",
      "px-8",
      "py-4",
      "bg-[#E8F0FE]",
      // "bg-opacity-80",
      "text-[#FF4444]",
      "rounded-3xl",
      "hover:bg-opacity-70",
      "transition",
      "font-semibold",
      "shadow-md"
    );
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
    saveCsvBtn.addEventListener("click", () => {
      let csvContent = "data:text/csv;charset=utf-8,";
      collegesData.forEach(function (rowArray) {
        let row = Object.values(rowArray).join(",");
        csvContent += row + "\r\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "colleges.csv");
      document.body.appendChild(link); // Required for FF
      link.click();
      document.body.removeChild(link);
    });
    collegeList.appendChild(saveCsvBtn);
  }
});
