from flask import Flask
from flask_restful import Resource, Api
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_curve
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import MinMaxScaler
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)

CORS(app)
class ROC(Resource):
    def get(self, preprocessing, c):
        # you need to preprocess the data according to user preferences (only fit preprocessing on train data)
        # fit the model on the training set
        # predict probabilities on test set
        if preprocessing == 'StandardScaler':
            scaler = StandardScaler()
            for col in X_train.columns:
                X_train[[col]] = scaler.fit_transform(X_train[[col]])
                X_test[[col]] = scaler.transform(X_test[[col]])
        if preprocessing == 'MinMaxScaler':
            scaler = MinMaxScaler()
            for col in X_train.columns:
                X_train[[col]] = scaler.fit_transform(X_train[[col]])
                X_test[[col]] = scaler.transform(X_test[[col]])

        classifier = LogisticRegression(C=c)
        clf = classifier.fit(X_train, y_train)
        # y_pred = clf.predict(X_test)
        probas = clf.predict_proba(X_test)

        fpr, tpr, thresholds = roc_curve(y_test, probas[:, 0], pos_label=0)

        result = []
        for x, y, z in zip(fpr, tpr, thresholds):
            d = {"fpr": x, "tpr": y, "threshold": z}
            result.append(d)

        return result
        # return the false positives, true positives, and thresholds using roc_curve()


# for examples see
# https://flask-restful.readthedocs.io/en/latest/quickstart.html#a-minimal-api

api.add_resource(ROC, '/roc/<preprocessing>/<float:c>')
if __name__ == '__main__':
    # load data
    df = pd.read_csv('./transfusion.data.txt')
    xDf = df.loc[:, df.columns != 'whether he/she donated blood in March 2007']
    y = df['whether he/she donated blood in March 2007']
    # get random numbers to split into train and test
    np.random.seed(1)
    r = np.random.rand(len(df))
    # split into train test
    X_train = xDf[r < 0.8]
    X_test = xDf[r >= 0.8]
    y_train = y[r < 0.8]
    y_test = y[r >= 0.8]
    app.run(debug=True, use_reloader=False)