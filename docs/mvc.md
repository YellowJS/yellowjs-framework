The MVC in Yellow JS
====================

YellowJS implements a MVC design pattern to clearly separate layers. Classes contained in the oo.model namespace help manage storage 
on the client or persistency of data over an internet connection. Data are displayed in views and user interaction on views are handled by controllers.

Models work with a proxy design pattern that allows you to use different data provider (even custom “made by you” data provider).

For views, YellowJS provides a collection of UI component that you can customize at will (you only need to know HTML/CSS)
and these components manage animation / transition.

Controllers allows you to simply organize your code.

each part of the MVC model of YellowJS has its own documentation