from flask import Flask, url_for, render_template, session, redirect
from flask_sso import SSO

app = Flask(__name__)
sso = SSO(app=app)

SSO_ATTRIBUTE_MAP = {
    'ADFS_AUTHLEVEL': (False, 'authlevel'),
    'ADFS_GROUP': (True, 'group'),
    'ADFS_LOGIN': (True, 'nickname'),
    'ADFS_ROLE': (False, 'role'),
    'ADFS_EMAIL': (True, 'email'),
    'ADFS_IDENTITYCLASS': (False, 'external'),
    'HTTP_SHIB_AUTHENTICATION_METHOD': (False, 'authmethod'),
}

app.config['SSO_ATTRIBUTE_MAP'] = SSO_ATTRIBUTE_MAP
app.secret_key = 'a_super_secret_key'

@app.route('/')
def index():
    if 'user' in session:
        #return 'Welcome {name}'.format(name=session['user']['nickname'])
        # return render_template('table.html')
        return render_template('index.html')
    return render_template('index.html')

@app.route('/table')
def table():
    return render_template('table.html')

@app.route('/visualizations')
def visualizations():
    return render_template('gender.html')

@app.route('/ageVisualizations')
def ageVisualizations():
    return render_template('age.html')

@app.route('/salaryVisualizations')
def salaryVisualizations(): 
    return render_template('salary.html')

@app.route('/login')
def login():
    session['user'] = True
    return render_template('table.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return render_template('index.html')


if __name__ == '__main__':
    #app.run(host='0.0.0.0', port=80)
    app.run(debug=True)
