from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from enum import Enum

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chores.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Chore(db.Model):
    group = db.Column(db.JSON)
    name = db.Column(db.String(128), nullable=False, primary_key=True) 
    assigned = db.Column(db.String(128), nullable=True)
    completed = db.Column(db.Boolean, default=False)

class Group(Enum):
    BASEMENT = "Basement"
    MAIN_FLOOR = "Main Floor"
    UPSTAIRS = "Upstairs"
    MAIN_AND_UPSTAIRS = "Main and Upstairs"
    ALL = "All"

    @staticmethod 
    def list():
        return list(map(lambda c: c.value, Group))


class User(db.Model):
    name = db.Column(db.String(128), nullable=False, primary_key=True)
    group = db.Column(db.JSON)
    preferences = db.Column(db.JSON)


# Gets chores for specific user
@app.route('/chores', methods=["GET"])
def get_chores():
    user_name = request.args.get('name')
    chores_list = Chore.query.filter_by(assigned=user_name)
    chores = [{"group":chore.group, "name":chore.name, "completed":chore.completed} for chore in chores_list]
    return jsonify({'chores':chores})

@app.route('/choresByUserGroup', methods=["GET"])
def get_chores_by_user_group():
    user_name = request.args.get('name')
    user_group = User.query.filter_by(name=user_name).first().group

    chores_by_group = get_chores_by_group(user_group)
    preferences = User.query.filter_by(name=user_name).first().preferences
    filtered_preferences = [chore for chore in preferences if chore in chores_by_group]

    chores = filtered_preferences + [chore for chore in chores_by_group if chore not in filtered_preferences] 

    return jsonify({'chores':chores}) 

@app.route('/choresByGroup', methods=["GET"])
def chores_by_group():
    group = request.args.get('group')
    return jsonify({'chores':get_chores_by_group(group)})

def get_chores_by_group(groups):
    all_chores = Chore.query.all()
    matching_chores = [chore for chore in all_chores if chore.group in groups]

    chores = [{"group":chore.group, "name":chore.name, "completed":chore.completed} for chore in matching_chores]
    return chores


@app.route('/allChores', methods=["GET"])
def get_all_chores():
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

    group = data['group']

    if not all(g in Group.list() for g in group):
        return jsonify({'error': 'Invalid group specified'}), 400

    new_user = User(name=data['name'], group=group)
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

def populate_db():
    if User.query.first() is not None or Chore.query.first() is not None:
        print("The database already contains data")
        return

    users = [
        {"name": "Dieter", "group":[Group.UPSTAIRS.value, Group.ALL.value, Group.MAIN_AND_UPSTAIRS.value]},
        {"name": "Graydon", "group":[Group.UPSTAIRS.value, Group.ALL.value, Group.MAIN_AND_UPSTAIRS.value]},
        {"name": "Levi", "group": [Group.MAIN_FLOOR.value, Group.ALL.value, Group.MAIN_AND_UPSTAIRS.value]},
        {"name": "Astrid", "group":[Group.MAIN_FLOOR.value, Group.ALL.value, Group.MAIN_AND_UPSTAIRS.value]},
        {"name": "Isaac", "group":[Group.BASEMENT.value, Group.ALL.value]},
        {"name": "Paul", "group":[Group.BASEMENT.value, Group.ALL.value]},
        {"name": "Katie", "group":[Group.BASEMENT.value, Group.ALL.value]},
    ]

    chores = [
            {"name":"Living Room Floors", "group":Group.ALL.value},
            {"name":"Kitchen Floors", "group":Group.MAIN_AND_UPSTAIRS.value},
    ]
    
    for user in users:
        new_user = User(name=user['name'], group=user['group'])
        db.session.add(new_user)

    for chore in chores:
        new_chore = Chore(name=chore['name'], group=chore['group'])
        db.session.add(new_chore)

    db.session.commit()
    print("Database populated with inital data")


if __name__ == '__main__':
    with app.app_context():
        populate_db()
    app.run(debug=True)
