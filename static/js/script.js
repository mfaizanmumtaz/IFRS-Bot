const form = document.getElementById("form");
const UserQuery = document.getElementById("UserQuery")
const error = document.getElementById("error");
const button=document.querySelector("button")
let caq=document.querySelectorAll(".caq")
caq.forEach(element => {
    element.addEventListener("click",()=>{
        UserQuery.value=element.innerText
    })
});
const formdata = { FirstQuery: "", GPTResponse: "" }

async function HideShow() {
    document.getElementsByTagName("section")[1].lastElementChild.remove()
    button.removeAttribute('disabled');
}

async function ShowHide() {
    document.getElementsByTagName("section")[1].insertAdjacentHTML("beforeend",`<div class="m-auto bg-white w-7 h-6 rounded-sm">
    <img src="/static/images/1481.gif" class="w-6 m-auto" alt="">
    </div>`)
    button.setAttribute("disabled",true)
}
function ShowNetWorkError() {
    HideShow()
    error.classList.remove("hidden");
    setTimeout(() => {
        error.classList.add("hidden")
    }, 3000);
}
async function PopulateText(GPTResponse) {
    Object.assign(formdata, { FirstQuery: UserQuery.value, GPTResponse: GPTResponse });
    return new Promise((resolve, reject) => {
        const GeneratedText=document.querySelector("#GeneratedText")
        const delay =5;
        let i = 0;
        const intervalId = setInterval(() => {
            GeneratedText.textContent+= GPTResponse[i];
            i++;
            if (i >= GPTResponse.length) {
                clearInterval(intervalId);
                resolve()
            }
        }, delay);
    })}
async function QuestionAnswer(){
        document.getElementsByTagName("section")[1].innerHTML = `<div class="w-full flex flex-col justify-center items-center text-white opacity-2 space-y-8 my-6">
          <div class="flex w-full px-4 md:px-24 space-x-6 bg-gray-700 py-4"><img src="/static/images/icons8-user-48.png" class="border rounded-lg h-8 w-8" alt="">
            <div id="UserQuery" class="text-sm md:text-base">
              ${UserQuery.value}
            </div>
          </div>
          <div class="flex w-full px-4 md:px-24 space-x-6"><img src="/static/images/chatgpt-icon.svg" class="w-8 h-8" alt=""><p id="GeneratedText" class="w-full leading-tight focus:outline-none text-sm md:text-base">
            </p>
          </div>
        </div>
        </div>`;}
form.addEventListener("submit",async(event)=>{
    event.preventDefault();
    await QuestionAnswer()
    await ShowHide()
    let Form = new FormData(form);
    Form.append("FirstQuery", formdata.FirstQuery)
    Form.append("GPTResponse", formdata.GPTResponse)

        try {
          const response = await fetch("/", {
            method: "POST", // or 'PUT'
            body:Form,
          });
          if (response.status===200){
              const result = await response.json();
              await PopulateText(result)
              await HideShow()
            }else{
                ShowNetWorkError()
            }
        } catch (error) {
          ShowNetWorkError()
          
        }
      });


  