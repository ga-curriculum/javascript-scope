# ![JavaScript Scope - Level Up - More About Global Scope](./assets/hero-more-about-global-scope.png)

The global scope in our browsers is represented by the `window` object. This means that it is at the top of the scope chain, and its properties are available to every function we write.

It is generally bad practice for our programs to create variables in the global scope, because this can overwrite data that is being used by JavaScript libraries, frameworks, or other routines.

Creating lots of global variables is known as “polluting the global scope." When we define a variable (or function) in the global scope, it becomes a property of the `window` object. We can see this in action by typing `var pollution = 'sucks'` in the console, then type window. (don’t forget the dot). If we scroll down, we will find the variable `pollution` that we created.

> 🧠 Interestingly, using both `var` and `let` in the global scope results in a global variable being created, however those created using let and const do not create properties on the `window` object like `var` does.
