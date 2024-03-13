import json

def main():
    with open('countries.json', 'r') as fp:
        countries_dict = json.load(fp)

    code_dict = {}

    for k in countries_dict:
        code_dict[countries_dict[k]] = k

    with open('codes.json', 'w') as fp:
        json.dump(code_dict, fp, sort_keys=True, indent=4)


if __name__ == "__main__":
    main()
