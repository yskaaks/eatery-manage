import os
from datetime import datetime
from flask import Blueprint, jsonify, send_file
from flask import request, current_app
from flask_praetorian import current_user, auth_required
from app.extensions import db
from app.models.eatery import Eatery, eatery_schema, eatery_schema_list, OpeningHours, open_hours_schema_list
from app.models.image import Image
from app.eatery_helper import generate_image_filename

eatery = Blueprint('eatery', __name__)


@eatery.get('/get_image/<int:image_id>')
def get_eatery_image(image_id):
    image_obj = Image.query.get_or_404(image_id)
    # image_objs has .id, .eatery_id, .filepath fields (def'n in models/image.py)
    return send_file(os.path.join(current_app.config['IMAGE_SAVE_DIRECTORY'], image_obj.filepath), mimetype='image/jpg')


@eatery.post('/add_image')
@auth_required
def add_image():
    if not isinstance(current_user(), Eatery):
        return jsonify(success=False), 403

    # save image on disk
    f = request.files['file']
    filename = generate_image_filename()
    f.save(os.path.join(current_app.config['IMAGE_SAVE_DIRECTORY'], filename))

    # new Image instance to database
    new_image = Image(filepath=filename, eatery_id=current_user().id)
    db.session.add(new_image)
    db.session.commit()

    return jsonify(success=True), 201


@eatery.delete('/delete_image')
@auth_required
def delete_image():
    req_json = request.get_json()
    image_id = req_json['image_id']

    # Check if 'image_id' is a string, and if so, apply 'strip()' method
    if isinstance(image_id, str):
        image_id = image_id.strip()

    # given image id, find image filepath from db
    image_obj = Image.query.filter_by(
        id=image_id, eatery_id=current_user().id).first_or_404()

    try:

        # Get File object path
        filename = image_obj.filepath
        file_path = os.path.join(
            current_app.config['IMAGE_SAVE_DIRECTORY'], filename)

        # delete image from disk
        os.remove(file_path)

        # delete image from db
        db.session.delete(image_obj)
        db.session.commit()
    except:
        return jsonify(success=False), 500

    return jsonify(success=True), 200


@eatery.get('/eatery')
def get_all_eateries():
    eateries = Eatery.query.all()
    return eatery_schema_list.dump(eateries), 200


@eatery.get('/eatery/<int:id>')
def get_eatery_by_id(id):
    eatery = Eatery.query.get_or_404(id)

    return eatery_schema.dump(eatery), 200


# API endpoint to Create/Update and also Get current_user Eatery opening hours 
@eatery.route('/eatery/opening_hours', methods=['GET', 'POST'])
@auth_required
def opening_hours():

    if request.method == 'POST':

        eatery_id = current_user().id
        
        data = request.json

        if not data or not isinstance(data, list):
            return jsonify({"success": False, "message": "Invalid data format. Expected a list of opening hours."}), 400

        try:

            # Delete existing opening hours for the eatery_id
            OpeningHours.query.filter_by(eatery_id=eatery_id).delete()

            # Insert new opening hours for the eatery_id
            for item in data:
                day_of_week = item.get('day_of_week')
                opening_time = datetime.strptime(
                    item.get('opening_time'), '%H:%M').time()
                closing_time = datetime.strptime(
                    item.get('closing_time'), '%H:%M').time()
                is_closed = item.get('is_closed', False)

                opening_hours = OpeningHours(
                    eatery_id=eatery_id,
                    day_of_week=day_of_week,
                    opening_time=opening_time,
                    closing_time=closing_time,
                    is_closed=is_closed
                )
                db.session.add(opening_hours)

            db.session.commit()
            return jsonify({"message": "Opening hours saved/updated successfully."}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Error occurred: {str(e)}"}), 500

    eatery_open_hours = current_user().opening_hours
    return open_hours_schema_list.dump(eatery_open_hours), 200