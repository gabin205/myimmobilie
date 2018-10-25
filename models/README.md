# fa17g16/models

Model files created by @chilly

Models describe an entity and allow for simplified access the database records. 
We use ObjectionJS as ORM Tool.
Model files extend the Model class provided by Objection and add description for fields of a model including validation rules to be used whenever one is trying to store a model to database.
Models allow for specification of relations to other models.
This allows for easier storing and loading of models with their relations. (eager loading)
Doing this allows to avoid the so called [SELECT N+1](https://stackoverflow.com/questions/97197/what-is-n1-select-query-issue) problem

