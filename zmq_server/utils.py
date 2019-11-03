import subprocess
import re


def network_state(ip_address):
    print("ping: {0}".format(ip_address))
    command="ping -c 1 {}".format(ip_address)
    p = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE, shell=True)
    output, errors = p.communicate()
    p.terminate()
    match_receive = re.findall(r'dev = (?:\d\.\d{3}\/){3}(.*?) ms', output.decode("gbk"))
    if match_receive:
        return float(match_receive[0])
    else:
        return 9999

