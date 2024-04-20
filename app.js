document.addEventListener("DOMContentLoaded", function () {
  let collegeList = document.querySelector("#collegeList"); //Div for collgList
  let searchBtn = document.querySelector("#searchBtn");

  searchBtn.addEventListener("click", async () => {
    let country = document.querySelector("#countryInp").value.toLowerCase();
    let state = capitalizeFirstLetter(
      document.querySelector("#stateInp").value.toLowerCase()
    );

    if (!state) {
      state = "null";
    }
    // if (!country || !state) {
    //   alert("Please enter both country and state.");
    //   return;
    // }
    console.log("btn clicked");
    console.log(country);

    let colleges = await getCollege(country);

    let filteredColleges =
      state !== "null"
        ? colleges.filter((coll) => coll["state-province"] === state)
        : colleges;
    if (filteredColleges.length === 0) {
      let icon = "not_found.gif";
      Swal.fire({
        title: "No Colleges Found",
        text: "Check for Spelling mistakes",
        icon: icon,
      });
      return;
    }

    console.log(filteredColleges);
    collegeList.innerHTML = "";
    showCollegeList(filteredColleges);
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

  function showCollegeList(collList) {
    for (coll of collList) {
      let collegeData = {
        flag: `https://flagsapi.com/${coll["alpha_two_code"]}/flat/64.png`,
        name: coll.name,
        state: coll["state-province"] === null ? "N/A" : coll["state-province"],
        web: `https://${coll.domains[0]}`,
      };
      console.log(collegeData.flag);
      console.log(collegeData.name);
      console.log(collegeData.state);
      console.log(collegeData.web);
      //College Div
      let college = document.createElement("div");
      college.classList.add(
        "rounded-lg",
        "shadow-xl",
        "shadow-gray-800",
        "w-full",
        "px-2",
        "h-16",
        "bg-[#ADADAD]",
        "flex",
        "justify-center",
        "items-center",
        "gap-1"
      );

      //Country Flag
      let countryFlag = document.createElement("div");
      let flagImg = document.createElement("img");
      flagImg.src = collegeData.flag;
      flagImg.classList.add("w-8", "h-6");

      countryFlag.appendChild(flagImg);
      college.appendChild(countryFlag);

      //College Name
      let collegeName = document.createElement("div");
      collegeName.innerText = collegeData.name;
      collegeName.classList.add(
        "w-12/12",
        "md:w-full",
        "text-base",
        "md:text-3xl",
        "font-serif",
        "text-center"
      );

      college.appendChild(collegeName);

      //College State
      let collegeState = document.createElement("div");
      collegeState.classList.add(
        "w-4/12",
        "md:w-3/12",
        "md:text-3xl",
        "flex",
        "gap-3"
      );
      let stateIcon = document.createElement("i");
      stateIcon.classList.add("fa-solid", "fa-location-dot");
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
        "w-1/12",
        "flex",
        "items-center",
        "justify-center"
      );
      collegeWeb.appendChild(webAnchor);
      college.appendChild(collegeWeb);

      collegeList.append(college);
    }
  }
});
