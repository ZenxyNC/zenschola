import { supabase } from "./supabase-client";

export var apiHitCounter = 0;

/**
 * Fetch lectures for a given day.
 * Supports positional arguments: fetchLectures(day, setLectures, setIsLecturesLoading)
 * Or options object: fetchLectures({ day, setLectures, setIsLecturesLoading })
 */
export async function fetchLectures(day = "monday", setLectures, setIsLecturesLoading) {
  let lectureDay = day;
  let lecturesSetter = setLectures;
  let loadingSetter = setIsLecturesLoading;

  // Get cached lectures in local storage

  // Cehck last refreshed time
  const localLastRefresh = localStorage.getItem("zenschola-lectures-lastrefresh");

  // If last refreshed time is today, return cached lectures
  if (localLastRefresh === day) {
    const localLectures = localStorage.getItem("zenschola-lectures");
    if (localLectures) {
      try {
        const parsedLectures = JSON.parse(localLectures);
        const sortedCached = parsedLectures.slice().sort((a, b) => (a.startTime > b.startTime ? 1 : a.startTime < b.startTime ? -1 : 0));
        if (typeof lecturesSetter === "function") lecturesSetter(sortedCached);
        return sortedCached;
      } catch (e) {
        console.error("Error parsing local lectures:", e);
      }
    }
  }

  if (typeof day === "object" && day !== null) {
    ({ day: lectureDay = "monday", setLectures: lecturesSetter, setIsLecturesLoading: loadingSetter } = day);
  } else if (typeof setLectures === "object" && setLectures !== null) {
    ({ setLectures: lecturesSetter, setIsLecturesLoading: loadingSetter } = setLectures);
  }

  if (typeof loadingSetter === "function") loadingSetter(true);
  try {
    if (day === "all") {
      const { data, error } = await supabase
        .from("lectures")
        .select("*")
        .order('lectureCode', { ascending: true });

      if (error) throw error;
      if (typeof lecturesSetter === "function") lecturesSetter(data);
      return data;

    } else {
      const { data, error } = await supabase
        .from("lectures")
        .select("*")
        .eq("day", lectureDay);

        if (error) throw error;
        const sortedData = data.slice().sort((a, b) => (a.startTime > b.startTime ? 1 : a.startTime < b.startTime ? -1 : 0));
        if (typeof lecturesSetter === "function") lecturesSetter(sortedData);
        localStorage.setItem("zenschola-lectures", JSON.stringify(sortedData));
        localStorage.setItem("zenschola-lectures-lastrefresh", day);
        return sortedData;
    }
  } catch (error) {
    console.error("Error fetching lectures:", error);
    return error;
  } finally {
    if (typeof loadingSetter === "function") loadingSetter(false);
    apiHitCounter++;
    console.log(`API hit for Fetching Lectures. Total Hit count: ${apiHitCounter}`);
  }
}

/**
 * Get user info saved in local storage.
 * Optionally updates userInfo state if setUserInfo is provided.
 */
export function getUserInfo(setUserInfo) {
  const localUserInfo = localStorage.getItem("zenschola-user-info");
  if (localUserInfo) {
    try {
      const parsedUserInfo = JSON.parse(localUserInfo);
      if (typeof setUserInfo === "function") setUserInfo(parsedUserInfo);
      return parsedUserInfo;
    } catch (e) {
      console.error("Error parsing local user info:", e);
    }
  }
  return null;
}

/**
 * Check and reset attendance if it is a new day.
 */
export async function checkAttendanceRefresh(lastRefresh, fallbackData, setUser) {
  const now = new Date();
  const currentDay = now.toISOString().slice(0, 10);
  if (lastRefresh === currentDay) {
    if (typeof setUser === "function") setUser(fallbackData);
    return fallbackData;
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        attendedLectures: [],
        attendanceLastRefresh: currentDay,
      })
      .eq("userid", fallbackData.userid)
      .select();
    if (error) throw error;
    if (typeof setUser === "function") setUser(data[0]);
    console.log(`API hit: `)
    return data[0];
  } catch (error) {
    console.error("Error resetting attendance:", error);
    if (typeof setUser === "function") setUser(fallbackData);
    return fallbackData;
  } finally {
    apiHitCounter++;
    console.log(`API hit for Attendance Refresh. Total Hit count: ${apiHitCounter}`);
  }
}

/**
 * Fetch user data from supabase and verify session.
 * Supports positional arguments: fetchUserdata(setUser, setUserInfo, setIsUserLoading)
 * Or options object: fetchUserdata({ setUser, setUserInfo, setIsUserLoading })
 */
export async function fetchUserdata(setUser, setUserInfo, setIsUserLoading) {
  let userSetter = setUser;
  let userInfoSetter = setUserInfo;
  let loadingSetter = setIsUserLoading;

  if (typeof setUser === "object" && setUser !== null && typeof setUser !== "function") {
    ({ setUser: userSetter, setUserInfo: userInfoSetter, setIsUserLoading: loadingSetter } = setUser);
  }

  if (typeof loadingSetter === "function") loadingSetter(true);
  const localUserId = getUserInfo(userInfoSetter)?.userid;
  console.log(localUserId);
  if (!localUserId) {
    //window.location.href = "https://zenxync.github.io/zenaccount/loginprovider?appOrigin=zenschola";
    if (typeof loadingSetter === "function") loadingSetter(false);
    return { ok: false };
  }

  // Get info from supabase
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("userid", localUserId);
    if (error) throw error;
    await checkAttendanceRefresh(data[0].attendanceLastRefresh, data[0], userSetter);
    return { ok: true, data: data[0] };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { ok: false, error };
  } finally {
    if (typeof loadingSetter === "function") loadingSetter(false);
    apiHitCounter++;
    console.log(`API hit for Fetching UserData. Total Hit count: ${apiHitCounter}`);
  }
}
