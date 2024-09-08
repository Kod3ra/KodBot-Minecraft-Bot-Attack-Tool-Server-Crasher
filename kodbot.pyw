import tkinter as tk
from tkinter import ttk
import subprocess

def start_bots():
    ip = ip_entry.get()
    bps = int(bps_entry.get())
    duration = int(time_entry.get())
    protocol = protocol_entry.get()
    method = method_combobox.get()
    
    command = [
        'node', 'botattack.js',
        '--ip', ip,
        '--bps', str(bps),
        '--time', str(duration),
        '--protocol', protocol,
        '--method', method
    ]
    
    subprocess.Popen(command)
    print(f"Command executed: {' '.join(command)}")

root = tk.Tk()
root.title("KodBot - Made By Kod3ra - Version 1")

# Set the application icon
root.iconbitmap('panel/ico.ico')

# Set window size and make it non-resizable
root.geometry('400x325')
root.resizable(False, False)

# Create a style
style = ttk.Style()
style.configure('TLabel', background='#f0f0f0', font=('Helvetica', 12))
style.configure('TEntry', padding=5, font=('Helvetica', 12))
style.configure('TCombobox', padding=5, font=('Helvetica', 12))
style.configure('TButton', padding=6, relief='flat', background='#4CAF50', foreground='white', font=('Helvetica', 12, 'bold'))

# Create a frame for the title
title_frame = ttk.Frame(root, padding="0", style='TFrame')
title_frame.grid(column=0, row=0, sticky=(tk.W, tk.E))

# Add a title label
title_label = ttk.Label(title_frame, text="Bot Settings", font=('Helvetica', 14), background='black', foreground='white', padding=5)
title_label.grid(column=0, row=0, sticky=(tk.W, tk.E))

# Make the title frame expand to fill the width
title_frame.grid_columnconfigure(0, weight=1)

# Create a frame for the form
form_frame = ttk.Frame(root, padding="20 20 20 20", style='TFrame')
form_frame.grid(column=0, row=1, sticky=(tk.W, tk.E, tk.N, tk.S))

# Create and place labels and input fields
ttk.Label(form_frame, text="Server IP:", style="TLabel").grid(column=0, row=0, padx=10, pady=5, sticky='e')
ip_entry = ttk.Entry(form_frame, style="TEntry")
ip_entry.grid(column=1, row=0, padx=10, pady=5, sticky='w')

ttk.Label(form_frame, text="Bots per second:", style="TLabel").grid(column=0, row=1, padx=10, pady=5, sticky='e')
bps_entry = ttk.Entry(form_frame, style="TEntry")
bps_entry.grid(column=1, row=1, padx=10, pady=5, sticky='w')

ttk.Label(form_frame, text="Duration (seconds):", style="TLabel").grid(column=0, row=2, padx=10, pady=5, sticky='e')
time_entry = ttk.Entry(form_frame, style="TEntry")
time_entry.grid(column=1, row=2, padx=10, pady=5, sticky='w')

ttk.Label(form_frame, text="Protocol:", style="TLabel").grid(column=0, row=3, padx=10, pady=5, sticky='e')
protocol_entry = ttk.Entry(form_frame, style="TEntry")
protocol_entry.grid(column=1, row=3, padx=10, pady=5, sticky='w')

ttk.Label(form_frame, text="Method:", style="TLabel").grid(column=0, row=4, padx=10, pady=5, sticky='e')
method_combobox = ttk.Combobox(form_frame, values=["Join", "DoubleJoin", "ExtremeJoin", "LegitNames", "InvalidNames", "PacketSpam"], state="readonly", style="TCombobox")
method_combobox.grid(column=1, row=4, padx=10, pady=5, sticky='w')
method_combobox.set("Join")  # Default value

start_button = ttk.Button(form_frame, text="Start", command=start_bots, style="TButton")
start_button.grid(column=0, row=5, columnspan=2, pady=10)

# Make the title frame expand to fill the width
root.grid_columnconfigure(0, weight=1)

root.mainloop()