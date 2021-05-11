window.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
  let delete_btn = document.querySelector("button#delete");
  delete_btn &&
    delete_btn.addEventListener("click", (e) => {
      const id = e.target.name;
      fetch(`/api/animals/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message);
          window.location.href = "/animals";
        })
        .catch((err) => {
          alert(err);
        });
    });
});
