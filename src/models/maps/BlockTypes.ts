const tmp = {
    None: 0,
    TopBlocked: 0,
    BottomBlocked: 0,
    LeftBlocked: 0,
    RightBlocked: 0,
    Interactable: 0,
}

const entries = Object.entries(tmp);

// Assign binary values
for (let i = 1; i < entries.length; i++) {    
    entries[i][1] = 1 << (i - 1);
}

const BlockTypes = Object.fromEntries(entries);

export default BlockTypes as typeof tmp;