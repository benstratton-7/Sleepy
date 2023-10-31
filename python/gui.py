from tkinter import *
from tkinter import ttk

def go(*args):
    try:
        u_n = username.get()
        unamview.set(u_n)
        print(u_n)
    except ValueError:
        pass


root = Tk()
root.title("Sleepy: Live Stats")
mainframe = ttk.Frame(root, padding="3 3 12 12")
mainframe.grid(column=0, row=0, sticky=(N, W, E, S))
root.columnconfigure(0, weight=1)
root.rowconfigure(0, weight=1)

username = StringVar()
unamview = StringVar()
feet_entry = ttk.Entry(mainframe, width=17, textvariable=username)
feet_entry.grid(column=1, row=1, sticky=(W,E))
ttk.Button(mainframe, text="Go", command=go).grid(column=2, row=1, sticky=W)
ttk.Label(mainframe, textvariable=unamview).grid(column=1, row=2, sticky=E)

for child in mainframe.winfo_children(): 
    child.grid_configure(padx=5, pady=5)

feet_entry.focus()
root.bind("<Return>", go)
root.mainloop()