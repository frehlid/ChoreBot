from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chores.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Chore(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    group = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(128), nullable=False) 
    assigned = db.Column(db.String(128), nullable=True)
    completed = db.Column(db.Boolean, default=False)

class Group(Enum):
    BASEMENT = "Basement"
    MAIN_FLOOR = "Main Floor"
    UPSTAIRS = "Upstairs"

    @staticmethod 
    def list():
        return list(map(lambda c: c.value, Group))


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    group = db.Column(db.String(50), nullable=False)
    preferences = db.Column(db.JSON)




# Gets chores for specific user
@app.route('/chores', methods=["GET"])
def get_chores():
    user_name = request.args.get('name')
    chores_list = Chore.query.filter_by(name=user_name)
    chores = [{"group":chore.group, "name":chore.name, "completed":chore.completed} for chore in chores_list]
    return jsonify({'chores':chores})

@app.route('/allChores', methods=["GET"])
def get_chores():
    chores_list = Chore.query.all()
    chores = [{"group":chore.group, "name":chore.name, "completed":chore.completed} for chore in chores_list]
    return jsonify({'chores':chores})

#adds to global list of chores
@app.route('/chores/add', methods=["POST"])
def add_chore():
    data = request.json 
    new_chore = Chore(name=data['name'], group=data['group'])
    db.session.add(new_chore)
    db.session.commit()
    return jsonify({'chore': {'group':new_chore.group, 'name':new_chore.name, "completed":new_chore.completed}}), 201

@app.route('/chores/updateStatus', methods=["POST"])
def update_chore_status():
    data = request.json
    chore = Chore.query.get(data['name'])
    if chore:
        chore.coompleted = data['isChecked']
        db.session.commit()
        return jsonify({'sucess':True}), 200
    return jsonify({'error': 'chore not found'}), 404

@app.route('/addUser', methods=["POST"])
def create_user():
    data = request.json
    if data['group'] not in Group.list():
        return jsonify({'error': 'Invalid group specified'}), 400

    new_user = User(name=data['name'], group=data['group'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'user': {'id': new_user.id, 'name': new_user.name, 'group': new_user.group}}), 201

@app.route('/login', methods=["GET"])
def check_user_exists():
    user_name = request.args.get('name')
    user = User.query.filter_by(name=user_name).first()
    return jsonify({'exists': bool(user)})

@app.route('/chores/updatePreferences', methods=["POST"])
def update_preferences():
    user_name = request.json['name']
    preferences = request.json['preferences']

    if not isinstance(preferences, list):
        return jsonify({'error': 'Preferences must be a list'}), 400

    user = User.query.filter_by(name=user_name).first()
    user.preferences = preferences
    db.session.commit()
    return jsonify({'success': True, 'preferences': user.preferences}), 200

if __name__ == '__main__':
    app.run(debug=True)
