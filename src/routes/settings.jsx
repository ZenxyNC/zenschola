import { use, useEffect, useState } from "react";
import SettingsComponent from "./components/settings-component";
import GlideSelect from "./glide-select";
import { fetchLectures } from "../functions";
import LectureSoftwareUrl from "./components/lecture-software";
import EditLectureSoftware from "./components/modals/edit-lecture-software";

export default function Settings({ userData, setUserData, userInfo}) {
  const [lectures, setLectures] = useState(null);
  const [isLecturesLoading, setIsLecturesLoading] = useState(false);

  const [settingsConfig, setSettingsConfig] = useState(() => {
    const localSettings = localStorage.getItem("zenschola-settings");
    if (localSettings) {
      try {
        return JSON.parse(localSettings);
      } catch (e) {
        console.error("Error parsing local settings:", e);
      }
    }
    return {
      theme: "dark",
      advancedVisual: true,
    };
  });

  async function getAllLectures() {
    await fetchLectures("all", setLectures, setIsLecturesLoading);
  }

  useEffect(() => {
    (async () => {
      getAllLectures()
    })();
  }, [])

  useEffect(() => {
    localStorage.setItem("zenschola-settings", JSON.stringify(settingsConfig));
    console.log("Local storage updated")
    const html = document.documentElement;
    html.classList.remove("dark", "light");
    html.classList.add(settingsConfig.theme);
  }, [settingsConfig])

  const Themes = [
    { value: "dark", label: "Dark", tag: "Minimalist Dark" },
    { value: "light", label: "Light", tag: "Minimalist Light" }
  ]
  const AdvancedVisual = [
    { value: true, label: "On", tag: "Some elements has transparency and live-blur effects." },
    { value: false, label: "Off", tag: "Solid color, better performance." }
  ]

  if (!userData || !lectures) return null;

  function getLectureSoftware(prop, targetLectureCode) {
    try {
      const findURL = userData?.lecturesSoftwareUrl.find(software => software.lectureCode == targetLectureCode);
      if(findURL) {
        if(prop == "name") {
          return findURL.name;
        } else if(prop == "url") {
          return findURL.url
        } else throw Error("Invalid property type")
      }
    } catch(e) {
      console.log("An error occured: ", e);
      return ""
    }
  }

  function logoutAndClear() {
    localStorage.removeItem("zenschola-lectures");
    localStorage.removeItem("zenschola-lectures-lastrefresh");
    localStorage.removeItem("zenschola-settings");
    localStorage.removeItem("zenschola-user-info");
    
    window.location.href = "https://zenxync.github.io/zenaccount/loginprovider?appOrigin=zenschola";
  }
  return (
    <>
      <EditLectureSoftware userData={userData} setUserData={setUserData} lectures={lectures} />
      <main className="
        w-full h-max flex justify-center items-center p-4 mt-15
      ">
        <div className="w-full max-w-180 h-max transparent flex flex-col gap-10">

          {/* Account */}
          <div name="account" className="flex flex-col gap-2">
            <h1>Account</h1>
            <div>
              <SettingsComponent
                title="Full Name"
              >
                <input
                  type="text"
                  className="w-50 h-8 bg-secondary rounded-lg border border-border px-2 focus:-outline-offset-1 focus:outline-1 focus:outline-accent focus:shadow-[0_0_6px_-1px_var(--color-accent)] disabled:opacity-60"
                  defaultValue={userInfo?.username ?? ""}
                  disabled={true}
                />
              </SettingsComponent>
              <SettingsComponent
                title="Nickname"
              >
                <input
                  type="text"
                  className="w-50 h-8 bg-secondary rounded-lg border border-border px-2 focus:-outline-offset-1 focus:outline-1 focus:outline-accent focus:shadow-[0_0_6px_-1px_var(--color-accent)] disabled:opacity-60"
                  defaultValue={userInfo?.first_name ?? ""}
                  disabled={true}
                />
              </SettingsComponent>
              <SettingsComponent
                title="User ID"
              >
                <div className="w-max max-w-50 truncate text-text-sec">{userInfo?.userid}</div>
              </SettingsComponent>
              <SettingsComponent
                title="Log out from current device"
              >
                <button onClick={() => logoutAndClear()} className="w-max h-8 px-3 py-1 bg-danger/12 cursor-pointer rounded-lg text-danger font-semibold text-base hover:bg-danger/20 transition-all duration-210">Log out</button>
              </SettingsComponent>
            </div>
          </div>

          {/* Preferences */}
          <div name="Preferences" className="flex flex-col gap-2">
            <h1>Preferences</h1>
            <SettingsComponent
              title="Theme"
            >
              <GlideSelect
                options={Themes}
                defaultValue={settingsConfig.theme}
                onChange={(value, option) => setSettingsConfig({ ...settingsConfig, theme: value })}
                ariaLabel="Theme"
                showTags={false}
                accentColor="#007AFF"
                surfaceColor="var(--color-secondary)"
                highlightColor="var(--color-primary)"
                textColor="var(--color-text-pri)"
                size="md"
                radius={11}
                menuWidth={150}
                placement="bottom"
                align="right"
                popDuration={180}
                glideDuration={210}
                rememberPosition={false}
                disabled={false}
                className="border border-border rounded-lg"
              />
            </SettingsComponent>
            <SettingsComponent
              title="Advanced Visual"
              description="Adding transparency and blur effects to create an immersive and premium looks."
            >
              <GlideSelect
                options={AdvancedVisual}
                defaultValue={settingsConfig.advancedVisual}
                onChange={(value, option) => setSettingsConfig({ ...settingsConfig, advancedVisual: value })}
                ariaLabel="Theme"
                showTags={false}
                accentColor="#007AFF"
                surfaceColor="var(--color-secondary)"
                highlightColor="var(--color-primary)"
                textColor="var(--color-text-pri)"
                size="md"
                radius={11}
                menuWidth={150}
                placement="bottom"
                align="right"
                popDuration={180}
                glideDuration={210}
                rememberPosition={false}
                disabled={false}
                className="border border-border rounded-lg"
              />
            </SettingsComponent>
          </div>

          {/* Variables */}
          <div name="Variables" className="flex flex-col gap-2">
            <h1>Variables</h1>
            {/* Study Software */}
            <div className="flex flex-col">
              <h2 className="mt-5">Study Software</h2>
              <p className="subtitle mt-2">
                This software will be used as a fallback—if there are no specific context or no software is set.
              </p>
              <SettingsComponent
                title="Software Name"
              >
                <input
                  type="text"
                  className="w-50 h-8 bg-secondary rounded-lg border border-border px-2 focus:-outline-offset-1 focus:outline-1 focus:outline-accent focus:shadow-[0_0_6px_-1px_var(--color-accent)] disabled:opacity-60"
                  defaultValue={userData?.studySoftwareName ?? ""}
                />
              </SettingsComponent>
              <SettingsComponent
                title="Software URL"
              >
                <input
                  type="text"
                  className="w-50 h-8 bg-secondary rounded-lg border border-border px-2 focus:-outline-offset-1 focus:outline-1 focus:outline-accent focus:shadow-[0_0_6px_-1px_var(--color-accent)] disabled:opacity-60"
                  defaultValue={userData?.studySoftwareUrl ?? ""}
                />
              </SettingsComponent>
            </div>

            {/* Lectures Software */}
            <div className="flex flex-col">
              <h2 className="mt-5">Lectures Software</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                {lectures?.length > 0 ? lectures.map((lec) => {
                  if (!lec.major?.[userData.major]) return null;

                  return (
                    <LectureSoftwareUrl
                      lectureCode={lec.lectureCode}
                      lectureName={lec.lectureName}
                      softwareName={getLectureSoftware("name", lec.lectureCode)}
                      softwareUrl={getLectureSoftware("url", lec.lectureCode)}
                    >

                    </LectureSoftwareUrl>
                  );
                }) : null}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
