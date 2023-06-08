from flask import Flask
import os
import openai
from flask import Flask,request,render_template,jsonify
app = Flask(  __name__,template_folder='templates',static_folder='static')
openai.api_key  = os.getenv('OPENAI_API_KEY')
def response_generater(prompt):
     try:
        response=openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        temperature=0.7,
        max_tokens=560,
        messages=prompt)
        content=response['choices'][0]['message']['content']
        return content.encode().decode('unicode-escape')
     except Exception as e:
         return None
def parametter(UserQuery,FirstQuery,GPTResponse):
      systembehaviour=f"You are an International Financial Reporting Standards assistant."
      prompt=([{"role": "system", "content": systembehaviour},
                 {"role": "user", "content":FirstQuery},
                 {"role": "assistant", "content": GPTResponse},
                 {"role": "user", "content": UserQuery},
                 ])
      return response_generater(prompt)

@app.route('/',methods=["GET","POST"])
def index():
    if (request.method=="POST"):
        UserQuery=request.form.get("UserQuery")
        FirstQuery=request.form.get("FirstQuery")
        GPTResponse=request.form.get("GPTResponse")
        response=parametter(UserQuery,FirstQuery,GPTResponse)
        if response is None:
             return jsonify("There is some error while processing your request please try again."),404
        else:
            return jsonify(response)
    return render_template("index.html")
app.run(debug=True,port=600)
