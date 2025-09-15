setTimeout(() => location.reload(), 5000); //lazy way of reloading the results page every 5 seconds

if (!document.querySelector("li").innerText.startsWith("No successful")){
  document.querySelector(".good-job").classList.remove("hidden")
}