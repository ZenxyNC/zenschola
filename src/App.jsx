import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"
import { fetchLectures, fetchUserdata } from "./functions"
import Main from "./routes/main"
import './assets/font-jakartaSans/importFont.css'
import './index.css'
import DevTools from "./routes/devtools"
import Settings from "./routes/settings"
import AddStudyUtility from "./routes/components/modals/add-study-utility"
import EditStudyUtility from "./routes/components/modals/edit-study-utility"
import StudentID from "./routes/components/student-id"
import Navbar from "./routes/components/navbar"

export default function App() {
  const [userData, setUserData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
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

  const [lectures, setLectures] = useState(null);
  const [isLecturesLoading, setIsLecturesLoading] = useState(false);

  useEffect(() => {
    const day = new Date().toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    (async () => {
      const userInformation = await fetchUserdata(setUserData, setUserInfo, setIsUserLoading);
      if (userInformation?.ok) await fetchLectures(day, setLectures, setIsLecturesLoading);
    })();
  }, []);

  return (
    <>
      <Router basename="/zenschola">
        <AddStudyUtility
          userData={userData}
          setUserData={setUserData}
        />
        <EditStudyUtility
          userData={userData}
          setUserData={setUserData}
        />
        <StudentID
          nim={userData?.nim}
          username={userInfo?.username}
          major={userData?.major}
        />
        <Navbar
          settingsConfig={settingsConfig}
          setSettingsConfig={setSettingsConfig}
        />
        <Routes>
          <Route path="/" element={
            <Main
              userData={userData}
              setUserData={setUserData}
              userInfo={userInfo}
              isUserLoading={isUserLoading}
              lectures={lectures}
              setLectures={setLectures}
              isLecturesLoading={isLecturesLoading}
              settingsConfig={settingsConfig}
              setSettingsConfig={setSettingsConfig}
            />
          } />
          <Route path="/dashboard" element={
            <Main
              userData={userData}
              setUserData={setUserData}
              userInfo={userInfo}
              isUserLoading={isUserLoading}
              lectures={lectures}
              setLectures={setLectures}
              isLecturesLoading={isLecturesLoading}
              settingsConfig={settingsConfig}
              setSettingsConfig={setSettingsConfig}
            />
          } />
          <Route path="/devtools" element={<DevTools />} />
          <Route path="/settings" element={
            <Settings
              userData={userData}
              setUserData={setUserData}
              userInfo={userInfo}
            />
          } />
        </Routes>
      </Router>
    </>
  )
}
