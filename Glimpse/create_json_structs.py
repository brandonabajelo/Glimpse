import os
import json
from dateutil import parser
import datetime

def read_data(path):
    return json.load(open(path, 'r'))

# Wheel chart for data visualization
# Displays each subcategory as a new layer outside the wheel
def sort_for_wheel_chart(data):
    department_mapping = {d['dept_no']: d['dept_name'] for d in data['departments']}

    salaries = {}
    for s in data['salaries']:
        if s['emp_no'] in salaries:
            salaries[s['emp_no']].append({'salary': s['salary'],
                                          'from_date': s['from_date'],
                                          'to_date': s['to_date']})
        else:
            salaries[s['emp_no']] = [{'salary': s['salary'],
                                      'from_date': s['from_date'],
                                      'to_date': s['to_date']}]

    titles = {}
    for t in data['titles']:
        if t['emp_no'] in titles:
            titles[t['emp_no']].append({'title': t['title'],
                                        'from_date': t['from_date'],
                                        'to_date': t['to_date']})
        else:
            titles[t['emp_no']] = [{'title': t['title'],
                                    'from_date': t['from_date'],
                                    'to_date': t['to_date']}]

    departments = {}
    for d in data['dept_emp']:
        if d['emp_no'] in departments:
            departments[d['emp_no']].append({'dept_name': department_mapping[d['dept_no']],
                                         'from_date': d['from_date'],
                                         'to_date': d['to_date']})
        else:
            departments[d['emp_no']] = [{'dept_name': department_mapping[d['dept_no']],
                                         'from_date': d['from_date'],
                                         'to_date': d['to_date']}]


    current_departments = {c['emp_no']: {'dept_name': department_mapping[c['dept_no']],
                                         'from_date': c['from_date'],
                                         'to_date': c['to_date']}
                           for c in data['current_dept_emp']}

    department_managers = {m['emp_no']: {'dept_name': department_mapping[m['dept_no']],
                                         'from_date': m['from_date'],
                                         'to_date': m['to_date']}
                           for m in data['dept_manager']}

    sorted_data = {v: {'employees': [],
                       'managers': []}
                   for _,v in department_mapping.items()}

    for i,e in enumerate(data['employees']):
        emp_data = e
        emp_data['current_department'] = current_departments[e['emp_no']]['dept_name']
        emp_data['departments'] = departments[e['emp_no']]
        emp_data['salaries'] = salaries[e['emp_no']]
        emp_data['titles'] = titles[e['emp_no']]

        if e['emp_no'] in department_managers:
            sorted_data[emp_data['current_department']]['managers'].append(emp_data)
        else:
            sorted_data[emp_data['current_department']]['employees'].append(emp_data)

    return sorted_data

# Gender chart
def sort_for_gender_chart(data):
    new_data = {k: {'male': 0, 'female': 0} for k in data.keys()}
    for dept, roles in data.items():
        male = female = 0
        for role, employees in roles.items():
            male += sum([1 for e in employees if e['gender'] == 'M'])
            female += sum([1 for e in employees if e['gender'] == 'F'])
        new_data[dept]['male'] = male
        new_data[dept]['female'] = female

    return new_data

# Sorting algorithm for age chart
def sort_for_age_chart(data):
    new_data = {53: 0,
                54: 0,
                55: 0,
                56: 0,
                57: 0,
                58: 0,
                59: 0,
                60: 0,
                61: 0,
                62: 0,
                63: 0,
                64: 0,
                65: 0,
                66: 0}
    now = datetime.datetime.now()

    for e in data['employees']:
        birth_year = parser.parse(e['birth_date'])
        age = int((now - birth_year).days / 365)
        new_data[age] += 1

    return new_data

# Sorting algorithm for salary graph
def sort_for_salary_graph(data):
    new_data = {}
    now = datetime.datetime.now()

    salaries = {}
    for s in data['salaries']:
        if s['emp_no'] in salaries:
            salaries[s['emp_no']].append(int(s['salary']))
        else:
            salaries[s['emp_no']] = [int(s['salary'])]

    for e in data['employees']:
        hire_date = parser.parse(e['hire_date'])
        years_worked = int((now - hire_date).days / 365)
        salary = max(salaries[e['emp_no']])

        if years_worked in new_data:
            new_data[years_worked].append(salary)
        else:
            new_data[years_worked] = [salary]

    avg_data = {k: int(sum(v)/len(v)) for k,v in new_data.items()}

    return avg_data

if __name__ == '__main__':
    #data = read_data('all_data.json')
    #wheel_data = sort_for_wheel_chart(data)
    #json.dump(wheel_data, open('wheel_data.json', 'w'))

    #data = read_data('wheel_data.json')
    #gender_by_dept = sort_for_gender_chart(data)
    #json.dump(gender_by_dept, open('gender_data.json', 'w'))

    #data = read_data('all_data.json')
    #age_histogram = sort_for_age_chart(data)
    #json.dump(age_histogram, open('age_data.json', 'w'))

    data = read_data('all_data.json')
    salary_over_years_worked = sort_for_salary_graph(data)
    json.dump(salary_over_years_worked, open('salary_data.json', 'w'))
