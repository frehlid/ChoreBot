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
    group = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(128), nullable=False, primary_key=True)
    completed = db.Column(db.Boolean, default=False)


@app.route('/chores', methods=["GET"])
def get_chores():
    chores_list = Chore.query.all()
    chores = [{"group":chore.group, "name":chore.name, "completed":chore.completed} for chore in chores_list]
    return jsonify({'chores':chores})

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


if __name__ == '__main__':
    app.run(debug=True)

