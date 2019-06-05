local Lexer = dofile("lex.lua")
local FormParser = {}

function FormParser:new(filename)
        
    local self = setmetatable({}, {__index = FormParser})
    
    -- read contents of file
    local handle = io.open(filename, "rb")
    if not handle then
        print("couldn't open " .. filename .. " for reading.")
        return nil
    end
    self.contents = handle:read("*all")
    handle:close()

    -- read line by line
    self.lines = {}
    local current = ""
    local index = 1
    while index <= self.contents:len() do
        local c = self.contents:sub(index, index)
        if c == "\n" then
            table.insert(self.lines, current)
            current = ""
        else
            current = current .. c
        end
        index = index + 1
    end

    return self

end

function FormParser:nextline(target)
    return self:nextline_n(target, 1)
end

function FormParser:nextline_n(target, distance)
    for i, v in ipairs(self.lines) do
        if v == target and i < #self.lines then
            return self.lines[i + distance]
        end
    end
    return ""
end

function FormParser::nextline_mul(target, n)
    for i, v in ipairs(self.lines) do
        if v == target and i < #self.lines then
            
        end
    end
end

function FormParser:PARSE_ALTAIR_FILE()

    local data = {
        client_first_name = self:nextline("First Name");
        client_last_name  = self:nextline("Last Name");
        client_email      = self:nextline("E-mail Address");
        altair_fileno     = self:nextline("Altair File Number");
        origin_addr       = self:nextline_n("Origin Address", 2);
        destination_addr  = self:nextline_n("Destination Address", 2);
        company_name      = self:nextline("Company Name");
    }

    for i, v in pairs(data) do
        print(i .. ": " .. v)
    end
end

local parser = FormParser:new("altair_sample.txt")
parser:PARSE_ALTAIR_FILE()
