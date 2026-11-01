export default function DevTools() {
  function saveLocalStorage() {
    localStorage.setItem("zenschola-user-info", JSON.stringify({"userid": "7a96d77f-d370-4256-aa08-8f72a9f1a5a9", "first_name":"Lucas","last_name":"Harel","username":"Lucas Harel","email":"lucasharelw@gmail.com","phone":"081225777660","password_hashed":"\",.<>/`~!#$'\",.< ()+=[]_<^')|[]{}|!@$%^^&*-(_+=[]{}|;:'\",!@#$%;:'\",."}))
  }
  function getLocalStorage() {
    return localStorage.getItem("zenschola-user-info")
  }
  return (
    <main className="mt-15">
      <button onClick={() => saveLocalStorage()}>Add item to local storage</button>
      {getLocalStorage()}
    </main>
  )
}